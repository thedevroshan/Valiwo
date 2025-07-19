import api from "../config/api.config";
import { IAPIReturn } from "../config/api.config";


export const GetUserProfileAPI = async ():Promise<IAPIReturn> => {
    const res = await api.get(`/api/v1/settings/profile`)
    return res.data;
}

export const UpdateProfileAPI = async ({field, fieldValue}:{field:string,fieldValue:string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/profile/update-profile?field=${field}&field_value=${fieldValue}`)
    return res.data;
}