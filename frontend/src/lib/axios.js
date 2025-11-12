import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'production' 
        ? '/api/v1' 
        : 'https://api.chaiteam.in/api/v1',
    withCredentials: true,
})