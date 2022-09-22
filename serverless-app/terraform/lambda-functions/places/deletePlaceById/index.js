const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

const deletePlace = async (username, placeId) => {
	const params = {
		TableName: "user-places",
		Key: {
			pk: username,
			sk: placeId,
		},
	};

	try {
		await dynamoClient.delete(params).promise();
	} catch (err) {
		throw err;
	}
};

exports.handler = async (event, context) => {
	const username = event.requestContext.authorizer.lambda.username;
	const placeId = event.pathParameters.placeId;

	// todo: find the place first and then compare the place creator username to the current username

	try {
		await deletePlace(username, placeId);
	} catch (err) {
		const response = {
			statusCode: 422,
			body: JSON.stringify({
				message: "Something went wrong. Could not delete place.",
			}),
		};
		return response;
	}

	return { message: "Deleted place" };
};
