import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserData,
  addUserData,
  deleteUserData,
} from '../controllers/dataController.js';

const router = express.Router();

router.route('/').get(protect, getUserData).post(protect, addUserData);
router.route('/:id').delete(protect, deleteUserData);

export default router;