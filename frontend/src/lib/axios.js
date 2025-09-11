import axios from "axios";

export const axiosTnstance = axios.create({
    baseUrl:
    import.meta.env.MODE === 'http://localhost:3000/api/v1' ,
    withCredentials:true,
})