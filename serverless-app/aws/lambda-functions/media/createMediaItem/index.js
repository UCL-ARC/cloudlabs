const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-userMedia-db";

exports.handler = async (event, context) => {
    const username = event.requestContext.authorizer.lambda.username;

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

    const createdMediaItem = {
        MediaTitle: body.title,
        MediaDescription: body.description,
        FileLocation: body.fileLocation, // upload to S3 currently happens on the frontend, move to a lambda instead?
        FileType: body.fileType,
    };

    let user;
    try {
        user = await findExistingUser(username);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong. Please try again later.",
            }),
        };
        return response;
    }

    if (user.Count === 0 || user.Items.length === 0) {
        const response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "Could not find user for provided credentials.",
            }),
        };
        return response;
    }

    const params = {
        TableName: tableName,
        Key: {
            pk: username,
            sk: "media." + uuidv4(),
        },
        UpdateExpression:
            "set MediaTitle = :title, MediaDescription = :description, FileLocation = :fileLocation, FileType = :fileType, GSI1 = :GSI1",
        ExpressionAttributeValues: {
            ":title": createdMediaItem.MediaTitle,
            ":description": createdMediaItem.MediaDescription,
            ":fileLocation": createdMediaItem.FileLocation,
            ":fileType": createdMediaItem.FileType,
            ":GSI1": "media",
        },
    };

    try {
        await dynamoClient.update(params).promise();
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Could not create media. Please try again later.",
            }),
        };
        return response;
    }

    return { media: createdMediaItem };
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
