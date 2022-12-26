import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {getTokenFromHeader} from "../helpers/helpers";
import {JWT_KEY} from "../config/constants";
const {AuthTokenBlackList} = require('../models/token.model')


const authenticateJWT = async (req: Request, res: Response<{} | Error>, next: NextFunction) => {
    const token = getTokenFromHeader(req.headers.authorization)
    const blt = await AuthTokenBlackList.findOne({token})
    if (blt) {
        res.status(403).json({ message: "Invalid token" })
    }
    if (token) {
        jwt.verify(token, JWT_KEY || '', async (err:  jwt.VerifyErrors | null) => {
            if (err) {
                return res
                    .status(403)
                    .send({ message: "Token Expired" })
            }
            next()
        })
    } else {
        res.status(403).json({ message: "UnAuthorized" })
    }
}

module.exports = authenticateJWT