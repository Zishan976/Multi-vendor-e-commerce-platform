import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file to Cloudinary and returns the secure URL
 * @param {string} localFilePath - Path to the local file
 * @returns {Promise<string>} - Cloudinary secure URL
 */
export const uploadToCloudinary = async (localFilePath) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: 'ecommerce/products', // Optional: organize in folders
            resource_type: 'image'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

/**
 * Deletes a local file from the filesystem
 * @param {string} localFilePath - Path to the local file
 */
export const deleteLocalFile = (localFilePath) => {
    try {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log('Local file deleted:', localFilePath);
        }
    } catch (error) {
        console.error('Error deleting local file:', error);
    }
};
