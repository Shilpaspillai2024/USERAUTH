import { Router} from "express";
import {registerUser,loginUser,getUser} from "../controller/authController";
import {uploadKYC } from "../controller/userController";
import auth from "../middleware/authMiddleware";



const router=Router();

router.post('/register',registerUser);


router.post('/login',loginUser);


router.get('/me',auth,getUser);


router.post('/upload-kyc',auth,uploadKYC);
export default router;