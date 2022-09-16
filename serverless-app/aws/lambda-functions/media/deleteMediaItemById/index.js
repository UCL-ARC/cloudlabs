const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-userMedia-db";

const deleteMediaItem = async (username, mediaItemId) => {
    const params = {
        TableName: tableName,
        Key: {
            pk: username,
            sk: mediaItemId,
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
    const mediaItemId = event.pathParameters.mediaItemId;

    // todo: find the place first and then compare the media item creator username to the current username

    try {
        await deleteMediaItem(username, mediaItemId);
    } catch (err) {
        const response = {
            statusCode: 422,
            body: JSON.stringify({
                message: "Something went wrong. Could not delete media item.",
            }),
        };
        return response;
    }

    return { message: "Deleted media item" };
};
