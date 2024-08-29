import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileCloudinary = (localFile) => 
{
    try {
        if (!localFile) return null ;

        // Upload local file on Cloudinary .

        cloudinary.uploader.upload(localFile)

    } catch (error) {
        
    }
};
