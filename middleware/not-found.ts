import {Response, Request} from "express";

const notFound = (req: Request, res: Response) => res.status(404).send('Route not found')

module.exports = notFound