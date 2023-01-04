import {AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY} from "../config/constants";
const AWS = require('aws-sdk')

AWS.config.update({region: 'us-east-1'})

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
})

module.exports = s3;