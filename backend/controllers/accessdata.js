// do RESTAPI on db
import Budget from "../models/Budget.js";


// ALL requests are BY UserID
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const budgets = await Budget.find({ userId });
    res.status(200).json({ success: true, data: budgets, message: "Successfully fetched budgets", userId: userId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const createBudgets = async (req, res) => {
  try {
    const { name, amount, percentage, icon, recommendations, color } = req.body;
    const userId = req.user.id;  // req.user is attached in auth middleware
    const budget = await Budget.create({ userId, name, amount, percentage, icon, recommendations, color });
    res.status(201).json({ success: true, data: budget, message: "Budget created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const updateBudgets = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, percentage, icon, recommendations, color } = req.body;
    const userId = req.user.id;  // req.user is attached in auth middleware
    const budget = await Budget.findByIdAndUpdate(id, { userId, name, amount, percentage, icon, recommendations, color }, { new: true });
    res.status(200).json({ success: true, data: budget, message: "Budget updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const deleteBudgets = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;  // req.user is attached in auth middleware
    await Budget.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// export const getBudgetsByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const budgets = await Budget.find({ userId });
//     res.status(200).json({ success: true, data: budgets, message: "Successfully fetched budgets" });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// }
