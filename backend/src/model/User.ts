import { Schema, model } from "mongoose";
import { IUser } from "../interface/User";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    kycVerified: {
      type: Boolean,
      default: false,
    },
    kycType: {
      type: String,
      enum: ["video", "image", null],
      default: null,
    },
    kycDate: {
      type: Date,
      default: null,
    },
    kycUrl:{
        type:String,
        default:null
    },
    kycPublicId:{
      type:String,
    }

  },
  {
    timestamps: true,
    // createdAt:{
    //     type:Date,
    //     default:Date.now
    // }
  }
);

export default model<IUser>("User", UserSchema);
