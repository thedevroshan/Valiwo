import api, {IAPIReturn} from "../config/api.config";

export const GetUserAPI = async ():Promise<IAPIReturn> => {
    const res = await api.get(`api/v1/user/`)
    return res.data;
}