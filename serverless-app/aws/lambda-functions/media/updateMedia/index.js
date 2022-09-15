const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: "eu-west-2",
});
const tableName = "cloudlabs-basic-db-userMedia";

const findExistingMedia = async (username, mediaId) => {
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
    const username = event.requestContext.authorizer.lambda.username;
    const mediaId = event.pathParameters.mediaId;

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

    let userMedia;
    try {
        userMedia = await findExistingMedia(username, mediaId);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong. Could not fetch media item",
            }),
        };
        return response;
    }

    if (userMedia.Count === 0 || userMedia.Items.length === 0) {
        const response = {
            statusCode: 404,
            body: JSON.stringify({
                message: "Could not find media with this ID.",
            }),
        };
        return response;
    }

    userMediaItem = userMedia.Items[0];

    userMediaItem.MediaName = title;
    userMediaItem.MediaDescription = description;

    const params = {
        TableName: tableName,
        Key: {
            pk: username,
            sk: mediaId,
        },
        UpdateExpression:
            "set MediaName = :title, MediaDescription = :description",
        ExpressionAttributeValues: {
            ":title": title,
            ":description": description,
        },
    };

    let updatedMediaItem;
    try {
        updatedMediaItem = await dynamoClient.update(params).promise();
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong. Could not update media item.",
            }),
        };
        return response;
    }

    return updatedMediaItem;
};
