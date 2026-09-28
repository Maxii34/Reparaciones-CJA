import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

const FOLDER = "sistema-reparacion/ordenes";

// Subida firmada (usa api_secret del backend, sin upload preset)
export const subirImagenCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: "image" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    stream.end(buffer);
  });
};

export const eliminarImagenCloudinary = (publicId: string): Promise<unknown> => {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

export default subirImagenCloudinary;
