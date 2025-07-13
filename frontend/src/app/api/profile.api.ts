import api from "../config/api.config";

export const GetUserProfileAPI = async () => {
    const res = await api.get(`/api/v1/settings/profile`)
    return res.data;
}