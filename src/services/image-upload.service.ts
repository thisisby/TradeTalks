import util from "util";
import fs from "fs";
import awsService from "./aws.service";

const unlinkFile = util.promisify(fs.unlink);

class ImageUploadService {

    async uploadSinglePhotoBuffer(data: any): Promise<string> {
        const timestamp = new Date().getTime();
        const fileName = `image_${timestamp}.jpg`;

        const result = await awsService.uploadBufferImage(data, fileName);
        return result.Location;
    }

    async uploadSinglePhoto(photo: Express.Multer.File): Promise<string> {
        const result = await awsService.uploadImage(photo);
        await unlinkFile(photo.path);
        return result.Location;
    }

    async uploadMultiplePhotos(photos: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = photos.map(async (photo) => {
            const result = await awsService.uploadImage(photo);
            await unlinkFile(photo.path);
            return result.Location;
        });

        return Promise.all(uploadPromises);
    }
}

export default new ImageUploadService()