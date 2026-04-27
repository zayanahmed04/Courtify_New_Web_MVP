import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {} else if (error.response.status === 500) {
                toast.error("🚨 Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            toast.error("⏱️ Request timeout. Please try again.");
        } else {
            toast.error("Something went wrong.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance