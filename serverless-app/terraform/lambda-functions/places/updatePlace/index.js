const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

const findExistingPlace = async (username, placeId) => {
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
	const username = event.requestContext.authorizer.lambda.username;
	const placeId = event.pathParameters.placeId;

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

	const title = body.title;
	const description = body.description;

	let userPlace;
	try {
		userPlace = await findExistingPlace(username, placeId);
	} catch (err) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Something went wrong. Could not fetch place",
			}),
		};
		return response;
	}

	if (userPlace.Count === 0 || userPlace.Items.length === 0) {
		const response = {
			statusCode: 404,
			body: JSON.stringify({
				message: "Could not find place with this ID.",
			}),
		};
		return response;
	}

	userPlace = userPlace.Items[0];

	userPlace.PlaceName = title;
	userPlace.PlaceDescription = description;

	const params = {
		TableName: "user-places",
		Key: {
			pk: username,
			sk: placeId,
		},
		UpdateExpression: "set PlaceName = :title, PlaceDescription = :description",
		ExpressionAttributeValues: {
			":title": title,
			":description": description,
		},
	};

	let updatedPlace;
	try {
		updatedPlace = await dynamoClient.update(params).promise();
	} catch (error) {
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				message: "Something went wrong. Could not update place.",
			}),
		};
		return response;
	}

	return updatedPlace;
};
