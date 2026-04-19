// utils/auth.js
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";

export const checkUserRole = async(requiredRole, navigate, setLoading) => {
    try {
        const res = await axiosInstance.get(API_PATH.AUTH.CURRENT_USER, {
            withCredentials: true,
        });
        const user = res.data.user;

        if (user.role !== requiredRole) {
            navigate("/unauthorized");
            return false;
        }
        return true;
    } catch (err) {
        navigate("/auth/login");
        console.log(err)
        return false;
    } finally {
        if (setLoading) setLoading(false);
    }
};