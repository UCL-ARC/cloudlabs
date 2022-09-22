// Lambda function 

const aws = require("aws-sdk");
const dynamoClient = new aws.DynamoDB.DocumentClient({
	region: "eu-west-2",
});

const createUserMedia = async (username, title, description, address) => {
    const params = {
        TableName: "users_and_places",
        ITEM:{
            "UserName" : {S: username},


        }
    };
    let response;
    try {
        response = await dynamoClient.putItem(params).promise();
    } catch (err) {
		throw err;
	}
    return response;
};


/**
 * getUserPlaces - gets all the places for the current user
 * @param {*} username 
 * @returns 
 */
const getUserMedia = async (username) => {
	const params = {
		TableName: "users_and_places",
        ProjectionExpression: "UserName, MediaItem",
        FilterExpression: "UserName = :UserName" ,
        ExpressionAttributeValues: {
			":UserName": username,
		},
	};

	let userPlaces;
	try {
		userPlaces = await dynamoClient.scan(params).promise();
	} catch (err) {
		throw err;
	}

	return userPlaces;
};

/**
 * deletes a recorded place for the current user
 * @param {*} username 
 * @param {*} placeId 
 */
const deleteMediaItem = async (username, placeId) => {
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


module.exports.handler = async(event, context) => {
    const username = event.requestContext.authorizer.lambda.username;
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch (event.routeKey) {
            case "DELETE /places/{id}": {
                const placeId = event.pathParameters.placeId;           
                try {
                    await deleteMediaItem(username, placeId);
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
            }
            case "GET /places": {
                let userPlaces;
                try {
                    userPlaces = await getUserMedia(username);
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
            }
            case "GET /places/{id}":
                break;
            case "POST /places":
                let response;
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
                const address = body.address;
                try {
                    response = await createUserMedia(username, title, description, address);
                } catch (err) {
                    const response = {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "Something went wrong. Could not get places.",
                        }),
                    };
                    return response;
                }
                           
                return response;
            case "PATCH /places/{id}":
                break;
        }
    } catch (error) {
        statusCode = 400;
        body = error.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
}
