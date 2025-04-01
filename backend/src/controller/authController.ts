import { Request, Response } from "express";
import User from "../model/User";
import { hashPassword,comparePassword } from "../utils/hashPassword";
import jwt from 'jsonwebtoken'
import { STATUS_CODE,MESSAGES } from "../constants/statuscode";

export const registerUser = async (req:Request,res:Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message:MESSAGES.EMAIL_PASSWORD_REQUIRED });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message:MESSAGES.USER_ALREADY_EXISTS});
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(STATUS_CODE.CREATED).json({ message:MESSAGES.REGISTRATION_SUCCESS});
  } catch (error) {
    console.error("Registration error", error);
    res.status(STATUS_CODE.SERVER_ERROR).json({ message:MESSAGES.SERVER_ERROR});
  }
};


export const loginUser=async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:MESSAGES.ADMIN_LOGIN_SUCCESS})
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(STATUS_CODE.UNAUTHORIZED).json({message:MESSAGES.INVALID_CREDENTIALS})
        }

        const isPassswordValid=await comparePassword(password,user.password)
        if(!isPassswordValid){
            return res.status(STATUS_CODE.UNAUTHORIZED).json({message:MESSAGES.INVALID_CREDENTIALS})
        }

        const payload={
            user:{id:user.id}
        }

        const token=jwt.sign(
           payload,
           process.env.JWT_SECRET as string,
           {expiresIn:"1h"}

        )

        res.status(STATUS_CODE.SUCCESS).json({
            message:MESSAGES.LOGIN_SUCCESS,
            token,
        })

    } catch (error) {
        console.error("Login error", error);
    res.status(STATUS_CODE.SERVER_ERROR).json({ message:MESSAGES.SERVER_ERROR});
    }
}


export const getUser=async(req:Request &{user?:{id:string}},res:Response)=>{
  try {
    const user=await User.findById(req.user?.id).select('-password');
    res.json(user);
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(STATUS_CODE.SERVER_ERROR).json({ message:MESSAGES.SERVER_ERROR});
  }
}