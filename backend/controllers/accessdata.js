// do RESTAPI on db
import Budget from "../models/Budget.js";
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const generateRecommendations = async(budget) => {
  const colors = ['#A8D5BA', '#FBC4AB', '#FFD6A5', '#B5EAD7', '#C7CEEA', '#FFABAB'];
  budget.color = colors[Math.floor(Math.random() * colors.length)];

  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `
  You are a smart budgeting assistant. A user has created a budget category:
  - Name: ${budget.name}
  - Amount: ${budget.amount}
  - Percentage of total: ${budget.percentage}%
  - Already spent: ${budget.expense}
  - Location: Davis, CA
  Give 3 helpful recommendations for managing or optimizing spending in this category. Be practical and specific.`;
  
  try {
    const response = await model.generateContent(prompt);
    const text = response.text;
    const recommendations = text.split('\n').filter(line => line.trim().startsWith('-')).map(r => r.replace(/^[-•]\s*/, ''));
    budget,recommendations = recommendations.slice(0, 3); // Max 3
  } catch (error) {
    console.error('Error generating recommendations: ', error.message);
  }

}

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
    const { name, amount, percentage, expense, icon, color } = req.body;
    const userId = req.user.id;  // req.user is attached in auth middleware
    const rawbudget = {name, amount, percentage, expense, icon, color};
    const ripebudget = generateRecommendations(rawbudget);
    const budget = await Budget.create({ userId, ...ripebudget });
    res.status(201).json({ success: true, data: budget, message: "Budget created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const updateBudgets = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First verify this budget belongs to the user
    const existingBudget = await Budget.findOne({ _id: id, userId });
    if (!existingBudget) {
      return res.status(404).json({ 
        success: false, 
        message: "Budget not found or unauthorized" 
      });
    }
    // console.log("Budget found:", existingBudget);

    // Only update the fields that are provided
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.amount) updates.amount = req.body.amount;
    if (req.body.percentage) updates.percentage = req.body.percentage;
    if (req.body.expense) updates.expense = req.body.expense;
    if (req.body.icon) updates.icon = req.body.icon;
    if (req.body.recommendations) updates.recommendations = req.body.recommendations;
    if (req.body.color) updates.color = req.body.color;

    const budget = await Budget.findByIdAndUpdate(
      id, 
      updates,
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      data: budget, 
      message: "Budget updated successfully" 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const deleteBudgets = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;  // req.user is attached in auth middleware
    const existingBudget = await Budget.findOne({ _id: id, userId });
    if (!existingBudget) {
      return res.status(404).json({ 
        success: false, 
        message: "Budget not found or unauthorized" 
      });
    }
    await Budget.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
