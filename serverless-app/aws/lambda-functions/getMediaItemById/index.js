const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
});
const tableName = process.env.TF_VAR_dynamodb_name;

const getUserMediaItem = async (username, mediaItemId) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: "#pk = :pk and #sk = :sk",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk",
        },
        ExpressionAttributeValues: {
            ":pk": username,
            ":sk": mediaItemId,
        },
    };

    let userMedia;
    try {
        userMedia = await dynamoClient.query(params).promise();
    } catch (err) {
        throw err;
    }

    return userMedia;
};

// gets a single media item belonging to a user
exports.handler = async (event, context) => {
    const username = event.pathParameters.username;
    const mediaItemId = event.pathParameters.mediaItemId;

    let userMediaItem;
    try {
        userMediaItem = await getUserMediaItem(username, mediaItemId);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong, could not find a media item.",
            }),
        };
        return response;
    }

    if (userMediaItem.Count === 0 || userMediaItem.Items.length === 0) {
        const response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "Could not find media for the provided id.",
            }),
        };
        return response;
    }

    return userMediaItem;
};
