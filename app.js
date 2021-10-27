"use strict";

/** Express app for Friender. */
require("dotenv").config();
const express = require("express");
// const cors = require("cors");

// const { NotFoundError } = require("./expressError");

// const { authenticateJWT } = require("./middleware/auth");
// const authRoutes = require("./routes/auth");
// const aws = require("./aws.js")

const app = express();

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

const uploadToS3 = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: AWSCredentials.bucketName,
        Key: fileName,
        Body: fileContent
    };
    console.log(params);
    
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadToS3("perry.jpg"); // file to upload

// app.use(cors());
// app.use(express.json());
// app.use(authenticateJWT);

// app.use("/auth", authRoutes);
// app.use("/companies", companiesRoutes);
// app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);


/** Handle 404 errors -- this matches everything */
// app.use(function (req, res, next) {
//   return next(new NotFoundError());
// });

/** Generic error handler; anything unhandled goes here. */
// app.use(function (err, req, res, next) {
//   if (process.env.NODE_ENV !== "test") console.error(err.stack);
//   const status = err.status || 500;
//   const message = err.message;

//   return res.status(status).json({
//     error: { message, status },
//   });
// });

module.exports = app;
