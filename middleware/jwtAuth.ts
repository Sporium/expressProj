import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {getTokenFromHeader} from "../helpers/helpers";
import {JWT_KEY} from "../config/constants";
import {StatusCodes} from "http-status-codes";
const {AuthTokenBlackList} = require('../models/token.model')


const authenticateJWT = async (req: Request, res: Response<{} | Error>, next: NextFunction) => {
    const token = getTokenFromHeader(req.headers.authorization)
    try {
        const blt = await AuthTokenBlackList.findOne({token})
        if (blt) {
            res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" })
        }
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
    }
    if (token) {
        jwt.verify(token, JWT_KEY || '', async (err:  jwt.VerifyErrors | null) => {
            if (err) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: "Invalid token" })
            }
            next()
        })
    } else {
        res.status(StatusCodes.FORBIDDEN).json({ message: "UnAuthorized" })
    }
}

module.exports = authenticateJWT