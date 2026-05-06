import axios from "axios";
import { normalizeApiError } from "../utils/apiError";

const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const baseURL = !rawBaseUrl || rawBaseUrl === "/"
    ? "http://localhost:5000"
    : rawBaseUrl.replace(/\/$/, "");

const axiosClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

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
