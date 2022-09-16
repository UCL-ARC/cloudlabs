const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-userMedia-db";

const getUserMedia = async (username) => {
    const params = {
        TableName: tableName,
        IndexName: "GSI1-pk-index",
        KeyConditionExpression: "#pk = :pk and #sk = :sk",
        ExpressionAttributeNames: {
            "#pk": "GSI1",
            "#sk": "pk",
        },
        ExpressionAttributeValues: {
            ":pk": "media",
            ":sk": username,
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

    let userMedia;
    try {
        userMedia = await getUserMedia(username);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong. Could not get media items.",
            }),
        };
        return response;
    }

    return userMedia;
};
