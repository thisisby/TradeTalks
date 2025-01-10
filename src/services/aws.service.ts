import S3 from "aws-sdk/clients/s3";
import { AWS } from "../config/settings";
import * as fs from "fs";


const s3 = new S3({
    credentials: {
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
    },
    endpoint: AWS.endpoint,
    sslEnabled: false,
    s3ForcePathStyle: true
});

class awsService {
    uploadBufferImage(data: any, fileName: string){
        const uploadParams = {
            Bucket: AWS.bucketName,
            Body: data,
            Key: fileName,
            ACL: "public-read",
        };

        return s3.upload(uploadParams).promise();
    }
    uploadImage(file: Express.Multer.File) {
        const fileStream = fs.createReadStream(file.path);

        const fileType = file.mimetype.split("/")[1];
        const uploadParams = {
            Bucket: AWS.bucketName,
            Body: fileStream,
            Key: file.filename + "." + fileType,
            ACL: "public-read",
        };

        return s3.upload(uploadParams).promise();
    }
}

export default new awsService();
