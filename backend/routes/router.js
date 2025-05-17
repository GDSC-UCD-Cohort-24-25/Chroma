import express from 'express';
import { register, login, refresh, logout, checkstatus, setTotal, getTotal } from '../controllers/user_auth.js';
import { getBudgets, createBudgets, updateBudgets, deleteBudgets, gernerateAPI } from '../controllers/accessdata.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
// router.get('/auth/checkstatus', auth, checkstatus)
router.get('/api/checkstatus', checkstatus); // No middleware
router.post('/api/settotal', auth, setTotal);
router.get('/api/gettotal', auth, getTotal);


// /budgets  (protected)
router.post('/api/generate', auth, gernerateAPI); // Generate recommendations API
router.get('/api/budgets', auth, getBudgets);
router.post('/api/budgets', auth, createBudgets);
router.put('/api/budgets/:id', auth, updateBudgets);
router.delete('/api/budgets/:id', auth, deleteBudgets);
// router.get('/api/budgets/user/:userId', auth, getBudgetsByUserId);


export default router;