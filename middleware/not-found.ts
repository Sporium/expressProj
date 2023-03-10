import {Response, Request} from "express";
import {StatusCodes} from "http-status-codes";

const notFound = (req: Request, res: Response) => res.status(StatusCodes.NOT_FOUND).json({message: 'Route not found'})

module.exports = notFound