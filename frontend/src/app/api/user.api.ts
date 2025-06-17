import api from "../config/api.config";

export const GetUserAPI = async () => {
    const res = await api.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/v1/user/isloggedin`)
    return res.data;
}