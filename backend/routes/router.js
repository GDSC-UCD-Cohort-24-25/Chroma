import express from 'express';
import { register, login, refresh, logout } from '../controllers/user_auth.js';
import { getBudget, updateBudget, updateBudgetCategory, deleteBudgetCategory } from '../controllers/accessdata.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// /auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);


// /api/budgets (protected)
router.get('/api/budgets', auth, getBudget);
router.post('/api/budgets/save', auth, updateBudget);
router.put('/api/budgets/category/update', auth, updateBudgetCategory);
router.delete('/api/budgets/category/delete', auth, deleteBudgetCategory);

export default router;