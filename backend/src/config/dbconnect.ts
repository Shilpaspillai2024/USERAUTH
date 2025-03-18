import mongoose from "mongoose";

const connectdb =async()=>{
    try {
        const connect=await mongoose.connect(`${process.env.MONGO_URI}`,{
        dbName:"Auth"
        })
        console.log("mongodb is connected")
        
    } catch (error) {
        console.log("error while connectiong with mongodb", error);
        process.exit(1) 
    }
}

export default connectdb;