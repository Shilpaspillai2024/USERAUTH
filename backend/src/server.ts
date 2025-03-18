import express from 'express'
import cors from 'cors';
import connectdb from './config/dbconnect';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'


dotenv.config();


const port =process.env.PORT || 5000
const app=express();

app.use(cors());

app.use(express.json());


connectdb();

app.use('/api/users',userRoutes);


app.get('/',(req,res)=>{
    res.send("Api is running")
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

