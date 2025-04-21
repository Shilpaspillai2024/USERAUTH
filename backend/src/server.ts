import express from 'express'
import cors from 'cors';
import connectdb from './config/dbconnect';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import errorHandler from './middleware/errorMiddleware';


dotenv.config();


const port =process.env.PORT || 5000
const app=express();




const allowedOrigins = ['https://userauth-delta.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(express.json());



connectdb();

app.use('/api/users',userRoutes);

app.use('/api/admin',adminRoutes);


app.get('/',(req,res)=>{
    res.send("Api is running")
})

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

