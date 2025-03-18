import { Document } from "mongoose";

export interface IUser extends Document{
    email:string,
    password:string,
    createdAt:Date,
}

export interface IUserRequest extends Request{
    user?:{
       id:string; 
    }
}