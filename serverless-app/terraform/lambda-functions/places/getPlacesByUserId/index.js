const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

const getUserPlaces = async (username) => {
	const params = {
		TableName: "user-places",
		IndexName: "GSI1-pk-index",
		KeyConditionExpression: "#pk = :pk and #sk = :sk",
		ExpressionAttributeNames: {
			"#pk": "GSI1",
			"#sk": "pk",
		},
		ExpressionAttributeValues: {
			":pk": "place",
			":sk": username,
		},
	};

	let userPlaces;
	try {
		userPlaces = await dynamoClient.query(params).promise();
	} catch (err) {
		throw err;
	}

	return userPlaces;
};

exports.handler = async (event, context) => {
	const username = event.pathParameters.username;

	let userPlaces;
	try {
		userPlaces = await getUserPlaces(username);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Something went wrong. Could not get places.",
			}),
		};
		return response;
	}

	return userPlaces;
};
