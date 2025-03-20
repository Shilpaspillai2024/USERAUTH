import axios from "axios";

const API_URL=import.meta.env.VITE_API_URL

export interface User{
    email:string;
    password:string;
}


export interface AdminCredentials {
    username: string;
    password: string;
  }

export const registerUser=async(userData:User)=>{
    return await axios.post(`${API_URL}/api/users/register`,userData)
}


export const loginUser=async(userData:User)=>{
    return await axios.post(`${API_URL}/api/users/login`,userData)
}


export const getUserData=async(token:string)=>{
    return await axios.get(`${API_URL}/api/users/me`,{
        headers:{
            'x-auth-token':token
        },
    });
}



  
  export const adminLogin = async (credentials: AdminCredentials) => {
    return await axios.post(`${API_URL}/api/admin/login`, credentials);
  };
  
  export const getUsers = async (
    token: string,
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ) => {
    return await axios.get(
      `${API_URL}/api/admin/users?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
  };
  
  export const getUserKYCDetails = async (token: string, userId: string) => {
    return await axios.get(`${API_URL}/api/admin/users/${userId}/kyc`, {
      headers: {
        "x-auth-token": token,
      },
    });
  };