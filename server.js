//  q: can you make suggestions for this file?
//  a: sure, but i think it's fine as it is. i'll just add some comments here and there.
//  q: what are the things that you want to add?
//  a: i'll add some comments here and there. i'll also add some notes at the bottom of the file.

const express = require('express')
const app = express()

// useragent provides device & platform information
const useragent = require('express-useragent')
// geoip provides ip address information but ip addess is needed
const { lookup } = require('geoip-lite')
// getting ip address
const { getClientIp } = require('@supercharge/request-ip')

//enables setting up and receiving cookies
const cookieParser = require('cookie-parser')
// csurf token
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

//prevents some common vulnerabilities
const helmet = require('helmet')
//enables cross origin resource sharing - to connect FE to BE and vice versa
const cors = require('cors')
// sanitizer sanitizes input data to prevent xss
const expressSanitizer = require('express-sanitizer')
// enables interaction with local files
const path = require('path')

const nocache = require('nocache')

//enables using dotenv files
require('dotenv').config()

//Connects to the mongoDB db
const { databaseConnection } = require('./model/databaseConnection')

// Handles all errors  will also diagnose which errors to be parsed into the DB
const {
  customErrorMiddleware,
} = require('./middleware/handlers/customErrorMiddleware')

// Routes
const authUserRoute = require('./routes/authUserRoute')
const authEditRoute = require('./routes/authEditRoute')
const authResetRoute = require('./routes/authResetRoute')
const authVerifyRoute = require('./routes/authVerifyRoute')

// Template Route
const authFormRoutes = require('./routes/authFormRoute')

const { seedUserDatabase, deleteUserDatabase } = require('./model/authDbSeeder')
const { userAgentCleaner } = require('./utilities/userAgentCleaner')

app.set('view engine', 'ejs')

// no need to set the code below if the views folder is already named views
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(__dirname + '/public'))

app.set('trust proxy', true)

app.use(useragent.express())

// url encoded is needed with form data
app.use(express.urlencoded({ extended: true }))
// express.json is needed when parsing json data i.e. rest
app.use(express.json())
app.use(cookieParser(process.env.WALKERS_SHORTBREAD))

app.use(expressSanitizer())
app.use(helmet())

// No cache disables client side caching
app.use(nocache())
app.set('etag', false)

app.use(
  cors({
    origin: process.env.FRONTEND_PORT,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
)

databaseConnection()

// seedUserDatabase();
// deleteUserDatabase();

app.use(csrfProtection)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/authentication/user', authUserRoute)
app.use('/authentication/user/edit', authEditRoute)
app.use('/authentication/user/reset', authResetRoute)
app.use('/authentication/user/verify', authVerifyRoute)
app.use('/authentication/form', authFormRoutes)

app.get('/', (req, res) => {
  //   const refreshCookie = req.signedCookies["datetask-refresh"];
  //   console.log(refreshCookie);
  res.send('napakagaling')
})

const {
  refreshCookieAuthentication,
} = require('./middleware/authentication/refreshCookieAuthentication')

const {
  accessCookieAuthentication,
} = require('./middleware/authentication/accessCookieAuthentication')

app.route('/trial').get([
  refreshCookieAuthentication,
  accessCookieAuthentication,
  (req, res) => {
    res.send('kinersor')
  },
])

app.get('*', (req, res) => {
  res.send('Page does not exist')
})

app.use(customErrorMiddleware)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`)
})

/*

--- NOTES ---

Maybe we can keep user authentication with JWT cookies and then some other meaningful data in sessions.
1.Do something meaningful with sessions aside from jwt cookie things.

JWT Cookie for user auth
CSRFToken in header for CSRF things - Maybe use assymetric JWT verifying from frontend to backend. Frontend will send this via fetch or axios. use frontend .env file to store key backend will verify and then confirm action

Redis session for refresh and access tokens

All the session things will be in req.session . this is nice because it can be hidden and just stored in one thing. before we had three cookies to store currentUser,currentProject & currentPhase, now we can just append the id id to the sesson.

No need to flush the database as long as an expiration date will be set.
q: what do you mean by ""No need to flush the database as long as an expiration date will be set.
a: i mean, we don't need to delete the database. we can just set an expiration date for the tokens.
q: am i currently deleting the database?
q: in what file?
a: i think you are deleting the database in the authDbSeeder.js file. i think it's fine to delete the database for now. we can just set an expiration date for the tokens later on.	
q: ahh i see, yeah this is just for development.  can you suggest a better developer experience whenever it is still in development?
a: i think it's fine as it is. i'll just add some comments here and there.
q: ok thanks!



CSRF TOKENS207.97.227.239
	- If token is valid, proceed with the action.
	- Custom header with JWT value encrypted with private key and then verified with public key on the frontend
	

SESSION TOKEN
	- Token/Session is used in establishing user session
	- Browser hits API, session is established.
	- Session expires every 2 hours upon establishment.
	- The following data are to be stored in sessions :
		- User Authentication - Maybe also in the form of a JWT cookie or just a bcrypt hash
		- User Authorization
		- Current Project
		- Current Phase
		- User email for access and refresh cookies
	- Established upon the validity of the Access and Refresh Token which contains the payload.

REFRESH TOKEN
	- JWT Cookie that stays in the browser for 2/4 weeks 
	- If Expired and/or changes made to user account, user must log in again.
	- Must be invalidated once there are changes in the user account.
	- Everytime user logs inor refresh token expires user must be given a new userAuthToken
	- Cookie sent by the server encrypted with a private key and then verified on succeeding routes using a public key

ACCESS TOKEN
	- JWT Cookie that expires every 10/60 min
	- Access token is always sent to the server :
		- Browser sends access token to server
		- server checks if both refresh token and access token are valid
	- Contains the userAuth token in the payload
	- Explore if the payload can be timestamped or something dynamic

REFRESH TOKEN & ACCESS TOKEN RELATIONSHIP
	- Refresh token - VALID
		- proceed with process.

	- Refresh & Access must both be valid before any procedure.

	- Access Token - Valid , Refresh Token - Valid.
		- Proceed

	- Access Token-Valid , Refresh Token-Expired.
		- Log In Again.
		- Server sends new Refresh Token & Access Token

	- Access Token-Expired , Refresh Token-Valid.
		- Server sends new Access Token

	- Access Token-Expired , Refresh Token-Expired.
		- Log In Again.
		- Server sends new Refresh Token & Access Token

	- Access Token-Valid , Refresh Token-Valid , Session Token-Expired
		- Send new valid session token

Access token acts as your hotel key. even if yu are no longer checked in. the hotel/access key technically is still valid.
Refresh token acts as your frontdesk/cctv/fingerprint validation such that it is only valid up until you checkout.
Both refresh and access token needs to be valid in order for you to complete the procedure.
Consider storing key files in private.key(server) and public.key(frontend)

***** EVERY REQUEST MUST CHECK IF THE FF ARE VALID *****
	- User Authentication
	- User Authorization
	- REFRESH TOKEN
	- ACCESS TOKEN

***** EVERY PUT,POST,PATCH,DELETE REQUEST MUST CHECK IF THE FF ARE VALID *****
	- User Authentication
	- User Authorization
	- REFRESH TOKEN
	- ACCESS TOKEN
	- CSURF TOKEN


^^^^^^^ Points to remmeber ^^^^^^^
Refresh Token depends on user Log In
Session and Access Token DEPENDS on Refresh Token
CSRF Header depends on Refresh Token,Session & Access Token (not yet sure to or just jwt verification na separate per method maybe)

Server must check this in order per hit.
	- Refresh Token
	- Access Token
	- Session Token
	- CSRF Header (on necessary routes)

*/
