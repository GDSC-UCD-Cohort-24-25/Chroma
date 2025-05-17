import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/router.js';

const PORT = process.env.NodeJS_PORT || 3000;

const corsOptions = {
    origin: 'https://aggiepantry.org',  // Replace with your frontend URL
    credentials: true,  // Allow cookies to be sent
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());// enable cookie parser
app.use("/", userRoutes);       //  /auth  &  /budgets


app.listen(PORT,()=>{
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});
