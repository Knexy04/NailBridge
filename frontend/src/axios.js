import axios from "axios";
// eslint-disable-next-line

const instance = axios.create({
    //baseURL: "https://nailbridge.onrender.com"
    baseURL: "http://localhost:4444"
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');

    return config;
})

export default instance;