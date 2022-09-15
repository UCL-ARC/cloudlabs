const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-db-userMedia";

const getUserMedia = async (username, mediaId) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: "#pk = :pk and #sk = :sk",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk",
        },
        ExpressionAttributeValues: {
            ":pk": username,
            ":sk": mediaId,
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

exports.handler = async (event, context) => {
    const username = event.pathParameters.username;
    const mediaId = event.pathParameters.mediaId;

    let userMedia;
    try {
        userMedia = await getUserMedia(username, mediaId);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong, could not find a media item.",
            }),
        };
        return response;
    }

    if (userMedia.Count === 0 || userMedia.Items.length === 0) {
        const response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "Could not find media for the provided id.",
            }),
        };
        return response;
    }

    return userMedia;
};
