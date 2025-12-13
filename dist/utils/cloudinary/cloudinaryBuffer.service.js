"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferFile = void 0;
const cloudinary_1 = require("cloudinary");
let isCloudinaryInitialized = false;
const initCloudinary = () => {
  if (isCloudinaryInitialized) return;
  cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
  isCloudinaryInitialized = true;
};
const uploadBufferFile = async ({
  fileBuffer,
  storagePathOnCloudinary = "PriceTrackerApp",
  filename,
  mimeType,
}) => {
  initCloudinary();
  const folder = `${process.env.APP_NAME}/${storagePathOnCloudinary}`;
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary_1.v2.uploader.upload_stream(
      {
        folder,
        format: "png",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else if (result)
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        else reject(new Error("Cloudinary upload failed"));
      }
    );
    uploadStream.end(fileBuffer);
  });
};
exports.uploadBufferFile = uploadBufferFile;
