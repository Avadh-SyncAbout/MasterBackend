import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //Upload File on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //File has been uploaded sucessfull
    console.log("File is Upload on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
