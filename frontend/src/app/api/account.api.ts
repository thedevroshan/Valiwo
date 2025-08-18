import api from "../config/api.config";
import { IAPIReturn } from "../config/api.config";

export const ChangeAccountTypeAPI = async (accountType: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/account-type?type=${accountType}`)
    return res.data;
}

export const ChangeEmailAPI = async (email: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/email?email=${email}`)
    return res.data;
}

export const ChangePhoneAPI = async (phone: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/phone?phone=${phone}`)
    return res.data;
}

export const ChangeRecoveryEmailAPI = async (recovery_email: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/recovery-email?email=${recovery_email}`)
    return res.data;
}

export const ChangePasswordAPI = async ({current_password, new_password, confirm_password}:{current_password: string, new_password: string, confirm_password: string}):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/password`, {
        current_password, 
        password: new_password,
        confirm_password
    })
    return res.data;
}

export const ToggleTwoFactorAuthenticationAPI = async ():Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/two-factor-auth`)
    return res.data;
}

export const ChangeTwoFacOptionAPI = async (option: string):Promise<IAPIReturn> => {
    const res = await api.put(`api/v1/settings/account/two-factor-auth-option?option=${option}`)
    return res.data;
}