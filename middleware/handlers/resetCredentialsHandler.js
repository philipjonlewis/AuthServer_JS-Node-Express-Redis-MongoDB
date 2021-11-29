exports.resetCredentialsHandler = async (res) => {
	return await res
		.status(200)
		.clearCookie('__Secure-datetask', { path: '/' })
		.clearCookie('__Secure-datetask-access', { path: '/' })
		.clearCookie('__Secure-datetask-reset', { path: '/' })
		.header('Authorization', `Bearer `)
		.json({
			code: 200,
			status: true,
			response: 'Successfully edited account pleasee log in again',
		});
};


//
// TODO 
// ! Must be something something