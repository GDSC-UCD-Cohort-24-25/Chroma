import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email:email, password:hashedPassword });    // create: new + save
        res.status(201).json({success:true, message:"New Account Created", email: user.email});
    } catch (error) {
        res.status(400).json({success:false, message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;       //password here neeed 2b hashed
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success:false, message: "User not found with this email" });
        }
        if (!(await bcrypt.compare( password, user.password ))) {
            return res.status(400).json({ success:false, message: "Invalid password" });
        }
        res.status(200).json({ success:true, message:"Logged in successfully", email: user.email});
    }
    catch (error) {
        res.status(400).json({ success:false, message: error.message });
    }
}

// export const deleteUser = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOneAndDelete({ email: email });
//         if (!user) {
//             return res.status(400).json({ error: "Invalid email" });
//         }
//         res.status(200).json({ email: user.email });
//     }
//     catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }