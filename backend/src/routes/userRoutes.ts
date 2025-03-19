import { Router} from "express";
import {registerUser,loginUser,getUser} from "../controller/authController";
import { getAllUsers,uploadKYC } from "../controller/userController";
import auth from "../middleware/authMiddleware";



const router=Router();

router.post('/register',registerUser);


router.post('/login',loginUser);


router.get('/me',auth,getUser);


router.get('/all',auth,getAllUsers);

router.post('/upload-kyc',auth,uploadKYC);
export default router;