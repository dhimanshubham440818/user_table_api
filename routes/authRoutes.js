import express from 'express';
import {
  registerUser,
  authUser,
  googleUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);

// Google OAuth routes
router.post('/google', googleUser);


export default router;