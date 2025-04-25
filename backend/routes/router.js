import express from 'express';
import { register, login, refresh, logout } from '../controllers/user_auth.js';
import { getBudgets } from '../controllers/accessdata.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);


// /budgets  (protected)
router.get('/api/budgets', auth, getBudgets);
// router.post('/api/budgets', auth, createBudgets);
// router.put('/api/budgets/:id', auth, updateBudgets);
// router.delete('/api/budgets/:id', auth, deleteBudgets);
// router.get('/api/budgets/user/:userId', auth, getBudgetsByUserId);


export default router;