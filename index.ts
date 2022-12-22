import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const routes = require('./routes/tasks')
//middlewares

app.use(express.json())

//routes
app.get('/hello', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/api/v1/tasks', routes)


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
}).on("error", err => {
    console.error(err)
    return err;
});