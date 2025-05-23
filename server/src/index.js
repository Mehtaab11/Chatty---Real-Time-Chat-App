import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/mesage.route.js';
import { connectDB } from './lib/db.js';
import cors from "cors"

dotenv.config();
const app = express();
const PORT = 5001 || process.env.PORT;

// app.use(express.json());
app.use(express.json({ limit: '5mb' })); // or even '10mb' if needed
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
}
);