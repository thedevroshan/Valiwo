import api from "../config/api.config";
import { IAPIReturn } from "../config/api.config";


export const GetUserProfileAPI = async ():Promise<IAPIReturn> => {
    const res = await api.get(`api/v1/settings/profile`)
    return res.data;
}

export const UpdateProfileAPI = async ({field, fieldValue}:{field:string,fieldValue:string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/profile/update-profile?field=${field}&field_value=${fieldValue}`)
    return res.data;
}

export const GetProfileLinksAPI = async ():Promise<IAPIReturn> => {
    const res = await api.get(`api/v1/settings/profile/link`)
    return res.data;
}

export const AddLinkAPI = async ({title, link}:{title:string,link:string}):Promise<IAPIReturn> => {
    const res = await api.post(`api/v1/settings/profile/link`, {
        title,
        link
    })
    return res.data;
}

export const EditLinkAPI = async ({title, link, linkId}:{title:string,link:string, linkId: string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/profile/link?link_id=${linkId}`, {
        title,
        link
    })
    return res.data;
}

export const RemoveLinkAPI = async ({linkId}:{linkId:string}):Promise<IAPIReturn> => {
    const res = await api.delete(`api/v1/settings/profile/link?link_id=${linkId}`)
    return res.data;
}

export const RemoveProfilePicAPI = async ():Promise<IAPIReturn> => {
    const res = await api.delete(`api/v1/settings/profile/profile-pic`)
    return res.data;
}

export const ChangeProfilePicAPI = async (fileBinary: Uint8Array):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/profile/profile-pic`, fileBinary, {
        headers: {
            "Content-Type": "application/octet-stream"
        }
    })
    return res.data;
}