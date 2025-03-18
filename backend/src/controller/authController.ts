import { Request, Response } from "express";
import User from "../model/User";
import { hashPassword,comparePassword } from "../utils/hashPassword";
import jwt from 'jsonwebtoken'

export const registerUser = async (req:Request,res:Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginUser=async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Please provide email and password"})
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'invalid credentails'})
        }

        const isPassswordValid=await comparePassword(password,user.password)
        if(!isPassswordValid){
            return res.status(401).json({message:'invalid credentails'})
        }

        const payload={
            user:{id:user.id}
        }

        const token=jwt.sign(
           payload,
           process.env.JWT_SECRET as string,
           {expiresIn:"1h"}

        )

        res.status(200).json({
            message:"Login successful",
            token,
        })

    } catch (error) {
        console.error("Login error", error);
    res.status(500).json({ message: "Server error" });
    }
}