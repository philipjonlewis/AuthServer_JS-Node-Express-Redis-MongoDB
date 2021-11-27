exports.jwtSignOptions = async (user) => {
	return {
		issuer: await user.username,
		subject: await user.email,
		audience: 'https://www.datetask.com',
		expiresIn: '672h',
		algorithm: 'RS256',
	};
};

exports.jwtAccessSignOptions = async (user) => {
	return {
		issuer: await user.username,
		subject: await user.email,
		audience: 'https://www.datetask.com',
		expiresIn: '1800000',
	};
};
