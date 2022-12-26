import {IUser} from "../models/user.model";
import jwt from "jsonwebtoken";
import {JWT_KEY} from "../config/constants";

export const getTokenFromHeader = (authorization: string | undefined) => {
    return authorization?.split(' ')[1] as string;
}

export interface JwtPayload extends IUser {}

export const generateJWT = (user: IUser) => {
    return jwt.sign(
        { id: user.id || '', name: user.name || '' },
        JWT_KEY,
        { expiresIn: "1h" }
    );
}
