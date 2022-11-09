const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION_LOCATION,
});
const tableName = process.env.AWS_DYNAMODB_TABLE;

const s3 = new aws.S3();
const s3Bucket = process.env.AWS_S3_BUCKET;

const getAllMediaItemsByUserId = async (username) => {
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

// requests temporary presigned urls to give access to private files in S3
const getPresignedUrl = async (filename) => {
    if (!filename) return;

    var params = {
        Bucket: s3Bucket,
        Key: filename,
        Expires: 60 * 5, // 5 mins
    };

    // is there some better error handling here?
    return new Promise((resolve, reject) => {
        resolve(s3.getSignedUrl("getObject", params));
    });
};

exports.handler = async (event, context) => {
    const username = event.pathParameters.username;

    let userMedia;
    try {
        userMedia = await getAllMediaItemsByUserId(username);
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong. Could not get media items.",
            }),
        };
        return response;
    }

    // get presigned urls for every media item so that private files can be temporarily shared
    // for more info, look up AWS presigned urls
    const itemsWithPresignedUrls = await Promise.all(
        userMedia.Items.map(async (mediaItem) => {
            return {
                ...mediaItem,
                presignedUrl: await getPresignedUrl(mediaItem.S3Filename),
            };
        })
    );

    return itemsWithPresignedUrls;
};
