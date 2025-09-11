import axios from "axios";

export const axiosTnstance = axios.create({
    baseURL: import.meta.env.MODE === 'production' 
        ? '/api/v1' 
        : 'http://localhost:3000/api/v1',
    withCredentials: true,
})