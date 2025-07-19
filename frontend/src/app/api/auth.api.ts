import api, {IAPIReturn} from '../config/api.config'


// Sign Up
export const SignUpAPI = async ({fullname, username, email, password,profile_pic, auth}:{fullname:string, username: string, email: string,password: string, auth:string | undefined, profile_pic: string | undefined}):Promise<IAPIReturn> => {
    const response = await api.post(`/api/v1/auth/signup?auth=${auth}`, {
        fullname,
        username,
        email,
        password,
        profile_pic
    })
    return response.data
}


// Login
export const SignInAPI = async ({email_or_username, password}:{email_or_username: string,password: string}):Promise<IAPIReturn> => {
    const response = await api.get(`/api/v1/auth/signin?email_or_username=${email_or_username}&password=${password}`)
    return response.data
}

// Logout
export const LogoutAPI = async () => {
    const response = await api.get(`/api/v1/auth/signout`)
    return response.data;
}