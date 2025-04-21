import { Request,Response,NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
  }

const errorHandler =(err:CustomError,req:Request,res:Response,next:NextFunction)=>{
    const statusCode=err.statusCode || 500
    res.status(statusCode);

    res.json({
        message:err.message || 'something went wrong',
       
    })
}
export default errorHandler;