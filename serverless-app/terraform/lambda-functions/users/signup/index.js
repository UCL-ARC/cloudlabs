const aws = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

exports.handler = async (event, context) => {
	// todo: need to upload avatar to S3 and extract file location here
	if (event.body == null) {
		const response = {
			statusCode: 422,
			body: JSON.stringify({
				message: "Invalid inputs passed. Please check your data.",
			}),
		};
		return response;
	}

	const body = JSON.parse(event.body);

	if (
		body.username == null ||
		body.username.length < 3 ||
		body.email == null ||
		body.email.length < 3 ||
		body.password == null ||
		body.password.length < 6
	) {
		const response = {
			statusCode: 422,
			body: JSON.stringify({
				message: "Invalid inputs passed. Please check your data.",
			}),
		};
		return response;
	}

	const username = body.username;
	const email = body.email;
	const password = body.password;

	let existingUser;
	try {
		existingUser = await findExistingUser(username);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Something failed. Please try again later.",
			}),
		};
		return response;
	}

	if (existingUser.Count > 0 || existingUser.Items.length > 0) {
		const response = {
			statusCode: 422,
			body: JSON.stringify({
				message: "User already exists. Please login instead.",
			}),
		};
		return response;
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Could not create user, please try again later.",
			}),
		};
		return response;
	}

	const createdUser = {
		pk: username,
		sk: "user." + uuidv4(),
		UserName: username,
		UserEmail: email,
		UserPassword: hashedPassword,
		UserImage: "test",
		//UserImage: req.file.location,
		//UserImage: req.file.path,
		GSI1: "user",
	};

	const params = {
		TableName: "user-places",
		Item: createdUser,
	};

	try {
		await dynamoClient.put(params).promise();
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Could not create user, please try again later.",
			}),
		};
		return response;
	}

	let token;
	try {
		token = jwt.sign(
			{ username: createdUser.pk, userId: createdUser.sk },
			"PF2wiPAjsxcM86tKyXSL",
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Could not create user, please try again later.",
			}),
		};
		return response;
	}

	const userData = JSON.stringify({
		userId: createdUser.sk,
		username: createdUser.pk,
		token: token,
	});

	return userData;
};

const findExistingUser = async (username) => {
	const params = {
		TableName: "user-places",
		KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
		ExpressionAttributeNames: {
			"#pk": "pk",
			"#sk": "sk",
		},
		ExpressionAttributeValues: {
			":pk": username,
			":sk": "user",
		},
	};

	let existingUser;
	try {
		existingUser = await dynamoClient.query(params).promise();
	} catch (err) {
		throw err;
	}

	return existingUser;
};
