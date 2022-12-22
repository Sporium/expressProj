import express, { Express } from 'express';
import "dotenv/config";
import mongoose from "mongoose";
const connectDB = require('./db-connect')

const app: Express = express();
const port = process.env.PORT;
const notFound = require('./middleware/not-found')
const routes = require('./routes/tasks')

mongoose.set('strictQuery', false);

//middlewares
app.use(express.json())

//routes
app.use('/api/v1/tasks', routes)
app.use(notFound)

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
        }).on("error", err => {
            console.error(err)
            return err;
        });
    }
    catch (e) {
        console.error(e)
    }
}
start()

