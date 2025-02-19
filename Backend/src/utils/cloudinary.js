import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );
    // console.log("File is Uploaded on Cloudinary : ",response.url)
    await fs.promises.unlink(localFilePath);
    return uploadResult
  } catch (error) {
   await fs.promises.unlink(localFilePath);
    return null ;
  }
};


export {uploadCloudinary}
