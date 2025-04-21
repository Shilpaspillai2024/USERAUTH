import axios from "axios";
import { getNewAccessToken } from "../api/api";

const API_URL=import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL:API_URL , 
    withCredentials: true, 
  });
  
  
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["x-auth-token"] = token; 
    }
    return config;
  });
  
 
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await getNewAccessToken();
          originalRequest.headers["x-auth-token"] = newToken;
          return api(originalRequest); 
        } catch (refreshError) {
          console.log("Token refresh failed, redirecting to login");
         
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default api;
  