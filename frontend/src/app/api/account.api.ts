import api from "../config/api.config";
import { IAPIReturn } from "../config/api.config";

export const ChangeAccountTypeAPI = async (accountType: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/account-type?type=${accountType}`)
    return res.data;
}