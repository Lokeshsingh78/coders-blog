import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demhugr1s',
  api_key: process.env.CLOUDINARY_API_KEY || '756897495379934',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'eaN-06sz74UyVP50jp8yrpb78ZY',
});

export default cloudinary;
