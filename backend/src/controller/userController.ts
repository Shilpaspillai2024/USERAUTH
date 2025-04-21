import { Request,Response } from "express";
import User from "../model/User";
import { STATUS_CODE,MESSAGES } from "../constants/statuscode";




export const uploadKYC =async(req:Request & {user?:{id:string}},res:Response,next:Function)=>{
    try {
        
        if(!req.user){
            return res.status(STATUS_CODE.UNAUTHORIZED).json({message:MESSAGES.UNAUTHORIZED})
        }

        const userId=req.user.id;

        const {kycUrl,kycPublicId,kycType } = req.body;

        console.log("kycType",kycType);
    
        if (!kycUrl || !kycPublicId || !kycType || (kycType !== "video" && kycType !== "image")) {
          return res.status(STATUS_CODE.BAD_REQUEST).json({ message:MESSAGES.INVALID_KYC_DATA});
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
          return res.status(STATUS_CODE.NOT_FOUND).json({ message:MESSAGES.USER_NOT_FOUND});
        }
        
       
        user.kycVerified = true;
        user.kycType = kycType;
        user.kycDate = new Date();
        user.kycUrl=kycUrl;
        user.kycPublicId = kycPublicId;
        
        await user.save();
        
        res.status(STATUS_CODE.SUCCESS).json({ 
          message:MESSAGES.KYC_UPLOADED_SUCCESS,
          kycType,
          kycDate: user.kycDate,
          kycUrl: user.kycUrl
        });
    } catch (error) {
      
      next(error)
    }
}