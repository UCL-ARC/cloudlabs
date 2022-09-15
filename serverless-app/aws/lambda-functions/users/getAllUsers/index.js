const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-db-userMedia";

const params = {
    TableName: tableName,
    IndexName: "GSI1-pk-index",
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
        "#pk": "GSI1",
    },
    ExpressionAttributeValues: {
        ":pk": "user",
    },
};

exports.handler = async (event, context) => {
    let allUsers;
    try {
        allUsers = await dynamoClient.query(params).promise();
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Fetching users failed. Please try again later",
            }),
        };
        return response;
    }

    if (allUsers.Count === 0 || allUsers.Items.length === 0) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Could not find any users.",
            }),
        };
        return response;
    }

    return allUsers;
};
