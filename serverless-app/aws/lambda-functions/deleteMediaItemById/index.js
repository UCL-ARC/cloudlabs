const aws = require("aws-sdk");

aws.config.update({ region: process.env.TF_VAL_aws_region });

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: process.env.TF_VAL_aws_region,
});
const tableName = process.env.TF_VAL_dynamodb_name;

const s3 = new aws.S3();
const s3Bucket = process.env.TF_VAL_s3_media_bucket_name;

const deleteMediaItemFromDb = async (username, mediaItemId) => {
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

const deleteMediaItemFromS3 = async (s3Filename) => {
    const params = {
        Bucket: s3Bucket,
        Key: s3Filename,
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (err) {
        throw err;
    }
};

exports.handler = async (event, context) => {
    const username = event.pathParameters.username;
    const mediaItemId = event.pathParameters.mediaItemId;

    const body = JSON.parse(event.body);
    const s3Filename = body.s3Filename;

    try {
        await deleteMediaItemFromDb(username, mediaItemId);
    } catch (err) {
        const response = {
            statusCode: 422,
            body: JSON.stringify({
                message:
                    "Something went wrong. Could not delete media item from the database.",
            }),
        };
        return response;
    }

    try {
        await deleteMediaItemFromS3(s3Filename);
    } catch (err) {
        const response = {
            statusCode: 422,
            body: JSON.stringify({
                message:
                    "Something went wrong. Could not delete media item from S3.",
            }),
        };
        return response;
    }

    return { message: "Deleted media item" };
};
