// do REST on db
import Budget from "../models/Budget.js";

export const getBudget = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const budgets = await Budget.findOne({ user: userId });

    if (!budgets || budgets.length === 0) {
      return res.status(404).json({ success: false, message: "No budgets found for this user" });
    }
    console.log(budgets);
    res.status(200).json({ success: true, data: budgets, message: "Successfully fetched budgets", userId: userId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
// create or update budget
export const updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const { budgetId, updatedBudget } = req.body;
    const { Categories } = req.body; // Extract Categories from req.body
    let budget = await Budget.findOne({ _id: budgetId, userId });
    
    if (!budget) {
        budget = new Budget({
            userId: req.user.id,
            Categories
        });

        await budget.save();
        return res.status(201).json({ success: true, data: budget, message: "Successfully created new budget" });
    }
    
    
    budget.Categories = updatedBudget.Categories || budget.Categories;
    await budget.save();
    
    res.status(200).json({ success: true, data: budget, message: "Successfully updated budget" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// update budget category
export const updateBudgetCategory = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const { budgetId, categoryId, updatedCategory } = req.body;
    
    // Find the budget by ID and userId
    const budget = await Budget.findOne({ _id: budgetId, userId });
    
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    
    // Find the category to update
    const category = budget.Categories.id(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Update the category fields
    Object.assign(category, updatedCategory);

    await budget.save();
    
    res.status(200).json({ success: true, data: budget, message: "Successfully updated budget category" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// delete budget category
export const deleteBudgetCategory = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const { budgetId, categoryId } = req.body;
    const budget = await Budget.findOne({ _id: budgetId, userId });
    
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    
    const category = budget.Categories.id(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.remove();
    
    await budget.save();
    
    res.status(200).json({ success: true, data: budget, message: "Successfully deleted budget category" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
