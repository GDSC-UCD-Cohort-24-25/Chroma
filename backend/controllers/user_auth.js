import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate
        if (!email || !password || !name) {
            return res.status(400).json({success:false, message:"Please provide email, password, and name"});
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({success:false, message:"User already exists with this email"});
        }
        // Hash the password, save user to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email:email, password:hashedPassword, name:name });    // create: new + save

        // Create JWT token
        const payload = {
            user: {
                id: user._id,
            }
        }
        const accessToken = generateAccessToken(payload);   // short lived: 2h
        const refreshToken = generateRefreshToken(payload);   // long lived: 7d
        // cookie1:2h
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 2*60*60*1000 });
        // cookie2:7d
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7*24*60*60*1000 });

        res.status(201).json({success:true, message:"New Account Created", email: user.email});
    } catch (error) {
        res.status(400).json({success:false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;       //password here is not hashed
        const user = await User.findOne({ email: email });
        // Authenticate
        if (!user) {
            return res.status(400).json({ success:false, message: "User not found with this email" });
        }
        if (!(await bcrypt.compare( password, user.password ))) {
            return res.status(400).json({ success:false, message: "Invalid password" });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user._id
            }
        }
        const accessToken = generateAccessToken(payload);   // short lived
        const refreshToken = generateRefreshToken(payload);   // long lived
        // cookie1:2h
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 2*60*60*1000 }); 
        // cookie2:7d
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7*24*60*60*1000 });

        res.status(200).json({ success:true, message:"Logged in successfully", email: user.email});
    }
    catch (error) {
        res.status(400).json({ success:false, message: error.message });
    }
};

function generateAccessToken(payload) {    //2h
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};
function generateRefreshToken(payload) {    //7d
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const refresh = async (req, res) => {
    // console.log(req.cookies);    //debug
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success:false, message: "No refresh token, please log in again" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success:false, message: "Invalid refresh token, please log in again" });
            }
            // decoded = { user: { id: 'example_id' }, iat: 1631012345, exp: 1631015945 }
            const newAccessToken = generateAccessToken({ user: decoded.user });
            // Store the new token in cookie
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 2 * 60 * 60 * 1000 // 2h
            });

            res.json({ success:true, message: "Token refreshed" });
        });
    } catch (error) {
        return res.status(400).json({ success:false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success:true, message: "Logged out successfully" });
};

export const checkstatus = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            res.status(401).json({ success:false, message: "No access token, please log in again" });
        }
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => async () => {
            if (err) {
                res.status(403).json({ success:false, message: "Invalid access token, please log in again" });
            }
            const user = await User.findById(decoded.user.id);
            if (!user) {
                res.status(404).json({ success:false, message: "User not found" });
            }
            res.status(200).json({ success:true, message: "User is logged in", name: user.name, email: user.email, total: user.total });
        });
    } catch (error) {
        res.status(400).json({ success:false, message: error.message });
    }
}

export const setTotal = async (req, res) => {
    try {
        const { total } = req.body;
        const userId = req.user.id;  // req.user is attached in auth middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success:false, message: "User not found" });
        }
        user.total = total;
        await user.save();
        res.status(200).json({ success:true, message: "Total updated successfully", total: user.total });
    }
    catch (error) {
        res.status(400).json({ success:false, message: error.message });
    }
}

export const getTotal = async (req, res) => {
    try {
        const userId = req.user.id;  // req.user is attached in auth middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success:false, message: "User not found" });
        }
        res.status(200).json({ success:true, message: "Total retrieved successfully", total: user.total });
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