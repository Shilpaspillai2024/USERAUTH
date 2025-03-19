import { Request,Response } from "express";
import User from "../model/User";


export const getAllUsers=async(req:Request,res:Response)=>{
    try {

        const page =parseInt(req.query.page as string) || 1;
        const limit =parseInt(req.query.limit as string) || 10;
        const search =req.query.search as string || "";


        const skip =(page -1) * limit;

        const searchQuery = search
        ? { email: { $regex: search, $options: 'i' } }
        : {};
      
      
      const totalUsers = await User.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalUsers / limit);
      
     
      const users = await User.find(searchQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      res.json({
        users,
        page,
        limit,
        totalPages,
        totalUsers
      });
        
    } catch (error) {
        console.error('Error fetching users:', error);
       res.status(500).json({ message: 'Server error' });
    }
}


export const uploadKYC =async(req:Request & {user?:{id:string}},res:Response)=>{
    try {
        
        if(!req.user){
            return res.status(401).json({message:'Unauthorized'})
        }

        const userId=req.user.id;

        const {kycUrl,kycPublicId,kycType } = req.body;

        console.log("kycType",kycType);
    
        if (!kycUrl || !kycPublicId || !kycType || (kycType !== "video" && kycType !== "image")) {
          return res.status(400).json({ message: "Invalid KYC data" });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
       
        user.kycVerified = true;
        user.kycType = kycType;
        user.kycDate = new Date();
        user.kycUrl=kycUrl;
        user.kycPublicId = kycPublicId;
        
        await user.save();
        
        res.status(200).json({ 
          message: 'KYC uploaded successfully',
          kycType,
          kycDate: user.kycDate,
          kycUrl: user.kycUrl
        });
    } catch (error) {
        console.error('Error uploading KYC:', error);
    res.status(500).json({ message: 'Server error' }); 
    }
}