import express from 'express';
import { register, login, refresh } from '../controllers/user_auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);


// /budgets
// router.get('/api/budgets', auth, getBudgets);


export default router;