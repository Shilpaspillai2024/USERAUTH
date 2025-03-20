import { Request,Response } from "express";
import User from "../model/User";
import jwt from 'jsonwebtoken'


export const adminLogin =async(req:Request,res:Response)=>{



    try {

        const{username,password}=req.body;

        if(
            username !==process.env.ADMIN_USERNAME ||
            password !==process.env.ADMIN_PASSWORD
        ){
            return res.status(401).json({message:"Invalid admin credentials"})
        }


        const payload={admin:true}


        const token=jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {expiresIn:"1h"}
        )
        res.status(200).json({
            message:"admin login successfull",
            token
        })

        
    } catch (error) {
        console.error("Admin login error", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const getUsers =async(req:Request &{admin?:boolean},res:Response)=>{
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
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



export const getUserKycDetails = async (req:Request & {admin?:boolean},res:Response)=>{
    try {
        
      if(!req.admin){
        return res.status(403).json({message:"Admin access required"})
      }

      const userId =req.params.userId
      const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      userId: user._id,
      email: user.email,
      kycStatus: user.kycVerified ? 'Verified' : 'Pending',
      kycType: user.kycType || 'Not provided',
      kycDate: user.kycDate || 'Not provided',
      kycUrl: user.kycUrl || 'Not provided'
    });


    } catch (error) {
        console.error('Error fetching user KYC details:', error);
        res.status(500).json({ message: 'Server error' });
    }
}