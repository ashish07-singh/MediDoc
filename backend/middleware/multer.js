import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Multer will first store files locally in /uploads
const upload = multer({ dest: "uploads/" });

// Helper function: upload file to Cloudinary and delete temp file
export const uploadToCloudinary = async (file, folder = "doctor_profiles") => {
  try {
    console.log('Starting Cloudinary upload for file:', file.path);
    console.log('Upload folder:', folder);
    
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      public_id: `${file.fieldname}-${Date.now()}`,  // ✅ fixed with backticks
      format: "png", // Force PNG format
    });

    console.log('Cloudinary upload successful:', {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    });

    // remove local file after upload
    fs.unlinkSync(file.path);
    console.log('Local file removed:', file.path);

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};

export default upload;
