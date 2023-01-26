const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
});
const tableName = process.env.TF_VAR_dynamodb_name;

console.log(tableName);

const s3 = new aws.S3();
const s3Bucket = process.env.TF_VAR_s3_media_bucket_name;

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
const preSignedUrl = async (filename) => {
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
    console.log("USERNAME ",username);
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
    console.log("Got the data out of the DynamoDB table");
    // get presigned urls for every media item so that private files can be temporarily shared
    // for more info, look up AWS presigned urls
    const itemsWithPresignedUrls = await Promise.all(
        userMedia.Items.map(async (mediaItem) => {
            return {
                ...mediaItem,
                presignedUrl: await preSignedUrl(mediaItem.S3Filename),
            };
        })
    );

    return itemsWithPresignedUrls;
};
