import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";


const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<{}> ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json(errors)
            }
            await fn(req,res,next)
        }
        catch (e) {
            return e;
        }
    }
}
module.exports = asyncWrapper