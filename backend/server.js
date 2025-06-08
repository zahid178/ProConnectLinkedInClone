import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))
app.use('/api', userRoutes);

app.set('json spaces', 4);

const start = async () => {
   try {
      const connectDB = await mongoose.connect('mongodb+srv://shaikhzahid178:YHuzxEIeM5u0v7LS@apnaproconnect.xdir2.mongodb.net/?retryWrites=true&w=majority&appName=apnaproconnect')
       console.log("Connected to MongoDB");
       app.listen(9080, () => {
           console.log("Server is running on port 9080");
       });
   } catch (error) {
       console.error("MongoDB connection error:", error);
   }
};

start();