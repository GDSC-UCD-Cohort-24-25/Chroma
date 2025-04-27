import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User
    total: { type: Number, default: 0 }, // Total budget amount
    Categories:[
        {
            name: { type: String, required: true }, // Budget category name
            amount: { type: Number, default:0 }, // Amount allocated
            percentage: { type: Number, required: true }, // Percentage of total budget
            icon: { type: String, default:"default_icon" }, // Icon URL or name
            recommendations: { type: [String], default: [] }, // Array of recommendations
            color: { type: String, default: '#3498db' } // Color hex code
        }
    ]
    
}, {
    timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema); // Generates "budgets" collection

export default Budget;
