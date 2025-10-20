import expess from 'express';
import { GetCloudinarySignature } from '../controllers/Cloudinary.controler.js';

const CloudinaryRouter = expess.Router();

CloudinaryRouter.get('/get-signature', GetCloudinarySignature);

export default CloudinaryRouter;
