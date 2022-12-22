import express, { Express } from 'express';
import "dotenv/config";
const connectDB = require('./db-connect')

const app: Express = express();
const port = process.env.PORT;
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const routes = require('./routes/tasks')

//middlewares
app.use(express.json())

//routes
app.use('/api/v1/tasks', routes)
app.use(notFound)
app.use(errorHandlerMiddleware)

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

