const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-userMedia-db";

const deleteMedia = async (username, mediaId) => {
    const params = {
        TableName: tableName,
        Key: {
            pk: username,
            sk: mediaId,
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
    const mediaId = event.pathParameters.mediaId;

    // todo: find the place first and then compare the place creator username to the current username

    try {
        await deleteMedia(username, mediaId);
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
