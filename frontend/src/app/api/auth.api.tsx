import api from '../config/api.config'


// Sign Up
export const SignUpAPI = async ({fullname, username, email, password}:{fullname:string, username: string, email: string,password: string}) => {
    const response = await api.post('/api/v1/auth/signup', {
        fullname,
        username,
        email,
        password
    })
    return response.data
}


// Login
export const LoginAPI = async ({email_or_username, password}:{email_or_username: string,password: string}) => {
    const response = await api.post('/api/v1/auth/signup', {
        email_or_username,
        password
    })
    return response.data
}