const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

const getUserPlace = async (username, placeId) => {
	const params = {
		TableName: "user-places",
		KeyConditionExpression: "#pk = :pk and #sk = :sk",
		ExpressionAttributeNames: {
			"#pk": "pk",
			"#sk": "sk",
		},
		ExpressionAttributeValues: {
			":pk": username,
			":sk": placeId,
		},
	};

	let userPlace;
	try {
		userPlace = await dynamoClient.query(params).promise();
	} catch (err) {
		throw err;
	}

	return userPlace;
};

exports.handler = async (event, context) => {
	const username = event.pathParameters.username;
	const placeId = event.pathParameters.placeId;

	let userPlace;
	try {
		userPlace = await getUserPlace(username, placeId);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Something went wrong, could not find a place.",
			}),
		};
		return response;
	}

	if (userPlace.Count === 0 || userPlace.Items.length === 0) {
		const response = {
			statusCode: 404,
			body: JSON.stringify({
				message: "Could not find place for the provided id.",
			}),
		};
		return response;
	}

	return userPlace;
};
