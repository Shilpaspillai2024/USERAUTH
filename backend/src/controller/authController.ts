import { Request, Response } from "express";
import User from "../model/User";
import { hashPassword,comparePassword } from "../utils/hashPassword";
import jwt from 'jsonwebtoken'
import { STATUS_CODE,MESSAGES } from "../constants/statuscode";
import BlacklistedToken from "../model/BlackListToken";

export const registerUser = async (req:Request,res:Response,next:Function) => {
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
    
    next(error)
  }
};


export const loginUser=async(req:Request,res:Response,next:Function)=>{
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

        const accessToken=jwt.sign(
           payload,
           process.env.JWT_SECRET as string,
           {expiresIn:"1h"}

        )

        const refreshToken =jwt.sign(payload,process.env.REFRESH_SECRET as string,
          {expiresIn:"1d"})


          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

        res.status(STATUS_CODE.SUCCESS).json({
            message:MESSAGES.LOGIN_SUCCESS,
            token:accessToken,
        })

    } catch (error) {
   
    next(error)
    }
}


export const getUser=async(req:Request &{user?:{id:string}},res:Response,next:Function)=>{
  try {
    const user=await User.findById(req.user?.id).select('-password');
    res.json(user);
    
  } catch (error) {
    
    next(error)
  }
}


export const logoutUser=async(req:Request,res:Response,next:Function)=>{
  try {
    const token=req.header('x-auth-token')
    if (!token) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    const expiresAt = new Date((decoded.exp as number) * 1000); 
    const blacklisted = new BlacklistedToken({ token, expiresAt });

    await blacklisted.save();

    res.status(STATUS_CODE.SUCCESS).json({ message: "Logout successful" });
    
  } catch (error) {
    next(error)
  }
};



export const refreshAccessToken=async(req: Request, res: Response, next: Function) => {
  try {

    const token=req.cookies.refreshToken;


    if(!token){
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "No refresh token found" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;

    const newAccessToken = jwt.sign(
      { user: { id: decoded.user.id } },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
    
  } catch (error) {
    res.status(STATUS_CODE.FORBIDDEN).json({ message: "Invalid or expired refresh token" });
  }
}