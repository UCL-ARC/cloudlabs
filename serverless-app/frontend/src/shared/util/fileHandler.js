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

export const handleUpload = async (file) => {
    const ReactS3Client = new S3(config);
    /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

    const newFileName = formatFileName(file);

    let uploadedFile;
    try {
        uploadedFile = await ReactS3Client.uploadFile(file, newFileName);
    } catch (err) {
        console.log(err);
    }

    return uploadedFile;
};

export const handleFileDelete = async (s3Filename) => {
    const ReactS3Client = new S3(config);
    /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

    const deletedFile = await ReactS3Client.deleteFile(s3Filename);

    return deletedFile;
};

const formatFileName = (file) => {
    const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const date = getDate();
    const randomString = uuidv4();

    const newFileName = `${cleanFileName}-${date}-${randomString}`;

    // maximum of 60 characters
    return newFileName.substring(0, 60);
};

const getDate = () => {
    let today = new Date();
    return today.toISOString().split("T")[0];
};
