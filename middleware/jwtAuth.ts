import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {getTokenFromHeader} from "../helpers/helpers";
import {JWT_KEY} from "../config/constants";

const authenticateJWT = async (req: Request, res: Response<{} | Error>, next: NextFunction) => {
    const token = getTokenFromHeader(req.headers.authorization)
    if (token) {
        jwt.verify(token, JWT_KEY || '', (err:  jwt.VerifyErrors | null) => {
            if (err) {
                return res
                    .status(403)
                    .send({ success: false, message: "Token Expired" })
            }
            next()
        })
    } else {
        res.status(403).json({ success: false, message: "UnAuthorized" })
    }
}

module.exports = authenticateJWT