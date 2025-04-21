import { Router} from "express";
import {registerUser,loginUser,getUser,refreshAccessToken, logoutUser} from "../controller/authController";
import {uploadKYC } from "../controller/userController";
import auth from "../middleware/authMiddleware";



const router=Router();

router.post('/register',registerUser);


router.post('/login',loginUser);


router.get('/me',auth,getUser);


router.post('/upload-kyc',auth,uploadKYC);

router.post('/logout',auth,logoutUser);

router.post("/refresh-token",refreshAccessToken);

export default router;