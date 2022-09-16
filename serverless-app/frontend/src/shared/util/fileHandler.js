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

    // need a try catch here
    const uploadedFile = await ReactS3Client.uploadFile(file, newFileName);

    return uploadedFile;
};

export const handleFileDelete = async (fileLocation) => {
    const ReactS3Client = new S3(config);
    /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

    const fileNameToDelete = getFileNameToDelete(fileLocation);

    if (fileNameToDelete == null) throw new Error("filename not found");

    const deletedFile = await ReactS3Client.deleteFile(fileNameToDelete);

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

const getFileNameToDelete = (fileLocation) => {
    // file name exists after the folder name which is media/
    // the +7 is the number of characters to move forwards to get to the filename

    // not currently storing files in an S3 child folder... so come back and check this
    const parsedFileName = fileLocation.substring(
        fileLocation.indexOf("/media/") + 7
    );

    return parsedFileName;
};
