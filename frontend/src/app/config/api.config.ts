import axios from "axios";

export interface IAPIReturn {
    ok: boolean,
    msg: string,
    data?: any;
}


const api = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "http://localhost:7000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.log("API Error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
