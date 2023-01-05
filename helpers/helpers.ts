import {UserDocument} from "../models/user.model";
import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_KEY} from "../config/constants";
import {IUserResource} from "../resources/user.resource";

export interface UserJwtPayload extends Omit<IUserResource, 'token'>, JwtPayload {}

export const getTokenFromHeader = (authorization: string | undefined): string => {
    return authorization?.split(' ')[1] as string;
}

export const generateJWT = (user: Pick<UserDocument,'name'| 'id'>) => {
    return jwt.sign(
        { id: user.id || '', name: user.name || '' },
        JWT_KEY,
        { expiresIn: "1h" }
    );
}

export const decodeJwt = (authorization: string | undefined): UserJwtPayload=> {
    return jwt.decode(getTokenFromHeader(authorization)) as UserJwtPayload

}