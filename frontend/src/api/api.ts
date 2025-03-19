import axios from "axios";

const API_URL=import.meta.env.VITE_API_URL

export interface User{
    email:string;
    password:string;
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