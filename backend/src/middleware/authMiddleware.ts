import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import BlacklistedToken from "../model/BlackListedToken";

interface DecodedToken{
    user:{
        id:string;
    };
}


interface AuthRequest extends Request{
    user?:{
        id:string;
    }
}

export default async function auth(req:AuthRequest,res:Response,next:NextFunction){

const token=req.header('x-auth-token');
if(!token){
    return res.status(401).json({message:'No token authorization denied'})
}

try {

    const blacklisted=await BlacklistedToken.findOne({token})
    if(blacklisted){
        return res.status(401).json({message:"Token has been blacklisted"})
    }

const decoded=jwt.verify(
    token,
    process.env.JWT_SECRET as string
)as DecodedToken;

req.user=decoded.user;
next();
    
} catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
}

}