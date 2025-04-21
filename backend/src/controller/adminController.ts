import { Request,Response } from "express";
import User from "../model/User";
import jwt from 'jsonwebtoken'
import {STATUS_CODE,MESSAGES,KYC_STATUS} from "../constants/statuscode";


export const adminLogin =async(req:Request,res:Response,next:Function)=>{
    try {

        const{username,password}=req.body;

        if(
            username !==process.env.ADMIN_USERNAME ||
            password !==process.env.ADMIN_PASSWORD
        ){
            return res.status(STATUS_CODE.UNAUTHORIZED).json({message:MESSAGES.INVALID_CREDENTIALS})
        }


        const payload={admin:true}


        const token=jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {expiresIn:"1h"}
        )
        res.status(STATUS_CODE.SUCCESS).json({
            message:MESSAGES.ADMIN_LOGIN_SUCCESS,
            token
        })

        
    } catch (error) {
       
        next(error)
    }
}


export const getUsers =async(req:Request &{admin?:boolean},res:Response,next:Function)=>{
    try {

        if(!req.admin){
            return res.status(403).json({message:"admin access denied"})
        }

        const page=parseInt(req.query.page as string) || 1;
        const limit=parseInt(req.query.limit as string) || 10;
        const search=req.query.search as string || "";


        const skip =(page-1) * limit;

        const searchQuery=search ? {
            email:{$regex:search, $options:'i'}} :{}


            const totalUsers =await User.countDocuments(searchQuery);
            const totalPages=Math.ceil(totalUsers /limit);


            const users = await User.find(searchQuery)
               .select('-password')
               .sort({createdAt:-1})
               .skip(skip)
               .limit(limit);



               res.json({
                users,
                page,
                limit,
                totalPages,
                totalUsers
               })
        
    } catch (error) {
        
        next(error)
    }
}



export const getUserKycDetails = async (req:Request & {admin?:boolean},res:Response,next:Function)=>{
    try {
        
      if(!req.admin){
        return res.status(STATUS_CODE.FORBIDDEN).json({message:MESSAGES.ADMIN_ACCESS_DENIED})
      }

      const userId =req.params.userId
      const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      userId: user._id,
      email: user.email,
      kycStatus: user.kycVerified ? KYC_STATUS.VERIFIED : KYC_STATUS.PENDING,
      kycType: user.kycType || KYC_STATUS.NOT_PROVIDED,
      kycDate: user.kycDate || KYC_STATUS.NOT_PROVIDED,
      kycUrl: user.kycUrl || KYC_STATUS.NOT_PROVIDED
    });


    } catch (error) {
        next(error)
    }
}