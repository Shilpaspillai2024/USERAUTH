import { Router } from "express";
import { adminLogin,getUserKycDetails,getUsers } from "../controller/adminController";
import { adminAuth } from "../middleware/adminMiddleare";


const router =Router();

router.post('/login', adminLogin);


router.get('/users', adminAuth, getUsers);
router.get('/users/:userId/kyc', adminAuth,getUserKycDetails);

export default router;