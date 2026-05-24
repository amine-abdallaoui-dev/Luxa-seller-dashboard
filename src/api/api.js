import axios from "axios";
const api = axios.create({
    baseURL : "https://luxa-backend.vercel.app/api",
    withCredentials: true,
});

export default api
