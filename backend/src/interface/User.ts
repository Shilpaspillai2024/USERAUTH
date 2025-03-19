import { Document } from "mongoose";

export interface IUser extends Document{
    email:string,
    password:string,
    kycVerified:boolean,
    kycType?:string,
    kycDate?:Date,
    kycUrl?:string,
    kycPublicId?:string,
    createdAt:Date,
    updatedAt: Date;
}

export interface IUserRequest extends Request{
    user?:{
       id:string; 
    }
}