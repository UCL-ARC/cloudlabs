const jwt = require("jsonwebtoken");

exports.handler = async (event, context) => {
	let token;

	let response = {
		isAuthorized: false,
	};

	if (event.headers !== null && event.headers !== undefined) {
		token = event.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return response;
	}

	try {
		const decodedToken = jwt.verify(token, "PF2wiPAjsxcM86tKyXSL");

		response = {
			isAuthorized: true,
			context: {
				username: decodedToken.username,
				userId: decodedToken.userId,
			},
		};
	} catch (err) {
		return response;
	}

	return response;
};
