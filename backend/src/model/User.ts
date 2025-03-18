import { Schema,model} from "mongoose";
import { IUser } from "../interface/User";

const UserSchema =new Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

export default model<IUser>('User',UserSchema);