const aws = require("aws-sdk");

aws.config.update({ region: "eu-west-2" });
const s3 = new aws.S3();

const s3Bucket = "cloudlabs-basic-user-media-file-storage";

// this function allows us to get a presigned url from aws S3
// we then make a PUT request on the frontend using this presigned url
// this then uploads a file directly to S3 which allows us to bypass lambda for any heavy lifting file uploads
exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const filename = body.filename;
    const fileType = body.fileType;

    const result = await getUploadURL(filename, fileType);

    return result;
};

const getUploadURL = async (filename, fileType) => {
    const s3Params = {
        Bucket: s3Bucket,
        Key: filename,
        ContentType: fileType,
        ACL: "public-read",
    };

    return new Promise((resolve, reject) => {
        // get signed url
        resolve({
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                uploadURL: s3.getSignedUrl("putObject", s3Params),
                fileName: filename,
            }),
        });
    });
};