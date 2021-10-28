const AWS = require('aws-sdk');
const fs = require('fs');

const AWSCredentials = {
    accessKey: process.env.accessKey, 
    secret: process.env.secret,
    bucketName: process.env.bucketName
};

const s3 = new AWS.S3({
    accessKeyId: AWSCredentials.accessKey,
    secretAccessKey: AWSCredentials.secret
});

function uploadToS3(fileName) {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: AWSCredentials.bucketName,
        Key: fileName,
        Body: fileContent
    };

    let fileLocation;
    console.log(params);
    
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        fileLocation= data.Location;
    });
    return fileLocation;
};

module.exports = { uploadToS3 };

// uploadToS3("perry.jpg"); // file to upload
