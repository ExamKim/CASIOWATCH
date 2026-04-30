import axios from "axios";
import { normalizeApiError } from "../utils/apiError";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
});

// Request interceptor: gắn token nếu có
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const normalizedMessage = normalizeApiError(error, "Request failed");
        error.normalizedMessage = normalizedMessage;
        return Promise.reject(error);
    }
);

export default axiosClient;