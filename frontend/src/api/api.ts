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

export interface KYCFiles {
    video?:Blob;
    image?:Blob;
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


  export const uploadKYC =async(files:KYCFiles,token:string)=>{
    try {
        const formData =new FormData();
        if(!token){
            throw new Error("No authentication token found");
        }
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  
        if (files.video) {
          formData.append("file", files.video, "kyc-video.webm");
  
          formData.append("upload_preset", uploadPreset);
          formData.append("resource_type", "video");
        } else if (files.image) {
          formData.append("file", files.image, "kyc-image.jpg");
          formData.append("upload_preset", uploadPreset);
          formData.append("resource_type", "image");
        }
  
        const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        const { secure_url, public_id, resource_type } = cloudinaryResponse.data;
  
        await axios.post(
          `${API_URL}/api/users/upload-kyc`,
          {
            kycUrl: secure_url,
            kycPublicId: public_id,
            kycType: resource_type === "video" ? "video" : "image",
          },
          { headers: { "x-auth-token": token } }
        );
  
        
       
        return true;
        
    } catch (error) {
        console.error("Error uploading KYC:", error);
        throw error; 
    }
  }