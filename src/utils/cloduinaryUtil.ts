import cloudinary from "../config/cloudinaryConfig";
import streamifier from "streamifier";

export async function uploadfiles(files: Express.Multer.File[]) {
  try {
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const stream_to_cloud_pipe = cloudinary.uploader.upload_stream(
          { folder: "teja_organics" },
          (error, result) => {
            if (error) return reject(error);
            if (result) {
              return resolve(result.secure_url);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
      });
    });

    const results = await Promise.all(uploadPromises);
    const images = results.map((imageData) => {
      return imageData;
    });
    return Promise.resolve(images);
  } catch (err) {
    return Promise.reject(err);
  }
}
