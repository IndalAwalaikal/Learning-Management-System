import axios from "axios";

// This placeholder will be replaced by the entrypoint script dynamically at runtime when built
// During local development (npm run dev), it will use the value from .env
const BASE_URL = import.meta.env.VITE_API_URL || "VITE_API_URL_PLACEHOLDER";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;

// Auto-clear stale auth state when server returns 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            localStorage.removeItem("data");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;