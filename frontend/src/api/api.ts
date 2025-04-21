import axios from "axios";
import api from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  email: string;
  password: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface KYCFiles {
  video?: Blob;
  image?: Blob;
}

export const registerUser = async (userData: User) => {
  return await axios.post(`${API_URL}/api/users/register`, userData);
};

export const loginUser = async (userData: User) => {
  return await api.post(`/api/users/login`, userData);
};

export const getUserData = async () => {
  return await api.get(`/api/users/me`);
};

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

export const uploadKYC = async (files: KYCFiles) => {
  try {
    const formData = new FormData();

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

    await api.post(
      `/api/users/upload-kyc`,
      {
        kycUrl: secure_url,
        kycPublicId: public_id,
        kycType: resource_type === "video" ? "video" : "image",
      },
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error("Error uploading KYC:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  return await api.post(`/api/users/logout`, {});
};

export const getNewAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    const { accessToken } = response.data;
    console.log("accesstoken", accessToken);
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    throw error;
  }
};
