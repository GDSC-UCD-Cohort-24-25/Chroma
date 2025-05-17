import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/router.js';

const PORT = process.env.NodeJS_PORT || 3000;
const allowedOrigins = ['https://cowculatorv2.vercel.app/'];
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allow cookies to be sent
};

const app = express();
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://cowculatortest.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());// enable cookie parser
app.use("/", userRoutes);       //  /auth  &  /budgets


app.listen(PORT,()=>{
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});
