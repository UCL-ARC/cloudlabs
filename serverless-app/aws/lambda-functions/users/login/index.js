const aws = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-db-userMedia";

exports.handler = async (event, context) => {
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

    if (body.username == null || body.password == null) {
        const response = {
            statusCode: 422,
            body: JSON.stringify({
                message: "Invalid inputs passed. Please check your data.",
            }),
        };
        return response;
    }

    const username = body.username;
    const password = body.password;

    let existingUser;
    try {
        existingUser = await findExistingUser(username);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something failed. Please try again later.",
            }),
        };
        return response;
    }

    if (existingUser.Count === 0 || existingUser.Items.length === 0) {
        const response = {
            statusCode: 422,
            body: JSON.stringify({
                message: "Invalid credentials. Could not log you in.",
            }),
        };
        return response;
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(
            password,
            existingUser.Items[0].UserPassword
        );
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message:
                    "Could not log you in, please check your credentials and try again.",
            }),
        };
        return response;
    }

    if (!isValidPassword) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Invalid credentials, could not log you in.",
            }),
        };
        return response;
    }

    let token;
    try {
        token = jwt.sign(
            {
                username: existingUser.Items[0].pk,
                userId: existingUser.Items[0].sk,
            },
            "alwkjfbaerG5H3jMV2qzT9",
            { expiresIn: "1h" }
        );
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Logging in failed, please try again later.",
            }),
        };
        return response;
    }

    const userData = JSON.stringify({
        username: existingUser.Items[0].pk,
        userId: existingUser.Items[0].sk,
        image: existingUser.Items[0].UserImage,
        token: token,
    });

    return userData;
};

const findExistingUser = async (username) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk",
        },
        ExpressionAttributeValues: {
            ":pk": username,
            ":sk": "user",
        },
    };

    let existingUser;
    try {
        existingUser = await dynamoClient.query(params).promise();
    } catch (err) {
        throw err;
    }

    return existingUser;
};
