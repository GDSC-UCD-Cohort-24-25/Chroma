// do authmiddleware & REST on db

import Budget from "../models/budget";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {   // middleware
  try {
    // const accessToken = req.headers.authorization.split(" ")[1];
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }
    // jwt vertify with callback!!
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }
        req.user = decoded.user; // Attach the decoded user to the request object
        next();
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
}

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;  // req.user is attached in auth middleware
    const budgets = await Budget.find({ userId });
    res.status(200).json({ success: true, data: budgets, message: "Successfully fetched budgets" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}