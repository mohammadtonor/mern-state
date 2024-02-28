import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL)

const app = express();

app.use('/api/users', userRouter)

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})