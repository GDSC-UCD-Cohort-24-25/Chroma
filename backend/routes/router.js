import express from 'express';
import { register, login } from '../controllers/user_auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);


// /budgets
    // wait for controller to be implemented


export default router;