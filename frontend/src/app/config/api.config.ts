import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string || 'http://localhost:7000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;