const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
});
const tableName = process.env.TF_VAL_dynamodb_name;

exports.handler = async (event, context) => {
    const username = event.pathParameters.username;

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
        FileLocation: body.fileLocation,
        FileType: body.fileType,
        S3Filename: body.s3Filename,
    };

    const params = {
        TableName: tableName,
        Key: {
            pk: username,
            sk: "media." + uuidv4(),
        },
        UpdateExpression:
            "set MediaTitle = :title, MediaDescription = :description, FileLocation = :fileLocation, FileType = :fileType, S3Filename = :s3Filename, GSI1 = :GSI1",
        ExpressionAttributeValues: {
            ":title": createdMediaItem.MediaTitle,
            ":description": createdMediaItem.MediaDescription,
            ":fileLocation": createdMediaItem.FileLocation,
            ":fileType": createdMediaItem.FileType,
            ":s3Filename": createdMediaItem.S3Filename,
            ":GSI1": "media",
        },
    };

    try {
        await dynamoClient.update(params).promise();
    } catch (err) {
        console.log(err);
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
