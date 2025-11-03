import axios, { formToJSON } from 'axios';

export const uploadToCloudinary = async (file) => {
  try {
    const { data: signatureData } = await axios.get(
      'http://localhost:3000/api/v1/cloudinary/get-signature',
    );

    console.log('Signature Data: ', signatureData);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.Data.apiKey);
    formData.append('timestamp', signatureData.Data.timestamp);
    formData.append('signature', signatureData.Data.signature);
    formData.append('folder', signatureData.Data.folder);
    

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dpze7fq1y/image/upload`,
      formData,
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('cloudinary Image Upload Failed: ', error.response);
    throw error;
  }
};
