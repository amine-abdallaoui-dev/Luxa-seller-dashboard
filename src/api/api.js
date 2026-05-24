import axios from "axios";
const api = axios.create({
    baseURL : "https://luxa-backend-359y.vercel.app/api",
    withCredentials: true,
});

export default api
