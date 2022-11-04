import S3 from "react-aws-s3";
const { v4: uuidv4 } = require("uuid");

window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
    bucketName: `${process.env.REACT_APP_AWS_S3_BUCKET_NAME}`,
    region: `${process.env.REACT_APP_AWS_REGION}`,
    accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_ID}`,
    secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`,
    dirName: "", // optional, will act as a folder for your S3 files
};

export const handleFileDelete = async (s3Filename) => {
    const ReactS3Client = new S3(config);

    const deletedFile = await ReactS3Client.deleteFile(s3Filename);

    return deletedFile;
};
