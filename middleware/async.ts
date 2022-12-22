import {NextFunction, Request, Response} from "express";


const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<{}> ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req,res,next)
        }
        catch (e) {
            return next(e);
        }
    }
}
module.exports = asyncWrapper