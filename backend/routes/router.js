import express from 'express';
import { register, login, refresh } from '../controllers/user_auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);


// /budgets
    // wait for controller to be implemented


export default router;