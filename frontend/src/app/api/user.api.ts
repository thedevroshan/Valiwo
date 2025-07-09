import api from "../config/api.config";

export const GetUserAPI = async () => {
    const res = await api.get(`/api/v1/user/`)
    return res.data;
}