import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {generateJWT, getTokenFromHeader} from "../helpers/helpers";
import {IUser, UserDocument} from '../models/user.model'
import * as Mongoose from "mongoose";
import {ApiRequestInterface, IErrorResponse} from "../types/types";
import {IUserResource} from "../resources/user.resource";
const {User} = require('../models/user.model')
const {AuthTokenBlackList} = require('../models/token.model')
const userResource = require('../resources/user.resource')

const asyncWrapper = require('../middleware/async')
const bcrypt = require("bcrypt")

async function generatePass(plaintextPassword: string) {
    return await bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword: string, hash: string) {
    return await bcrypt.compare(plaintextPassword, hash);
}


const signIn = asyncWrapper(async (req: Request, res: Response<IUserResource | IErrorResponse>) => {
    try {
        let { name, password } = req.body;
        let existingUser: UserDocument | null;
        existingUser = await User.findOne({ name });
        if (existingUser) {
            const isValid = await comparePassword(password, existingUser.password)
            const token = generateJWT(existingUser)
            if (isValid) {
                res.status(StatusCodes.CREATED).json({...userResource(existingUser, token) as IUserResource})

            }
        }
        res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid username or password"})
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
})

const register = asyncWrapper(async (req: ApiRequestInterface<{},{},IUser>, res: Response<IUserResource | IErrorResponse>) => {
    try {
        const pass = await generatePass(req.body.password)
        const user = await new User({
            name: req.body.name,
            password: pass,
        })

        const token = generateJWT({id: user._id, name: user.name})
        await user.save()
        res.status(StatusCodes.CREATED).json({...userResource(user, token) as IUserResource})

    }
    catch (e) {
        const err = e as Mongoose.Error
        if (err.name === 'MongoError' && err.code === 11000) {
            const keys = Object.keys(err.keyValue)
            const responseMessage = keys?.map(key => {
                return {
                    [key]: `This ${key} is already taken`
                }
            })
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: responseMessage})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err})
    }
})

const signOut = asyncWrapper(async (req: Request, res: Response<IErrorResponse>) => {
    try {
        const token = getTokenFromHeader(req.headers.authorization)
        if(!token) {
            res.status(StatusCodes.OK).json({message: "Error!Token was not provided."});
        }
        res.status(StatusCodes.OK).json();
        }
    catch (e) {
        const err = e as Mongoose.Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err})
    }
})

//add token to blacklist
const invalidateJWT = asyncWrapper(async (req: Request, res: Response<IErrorResponse>) => {
    try {
        const token = getTokenFromHeader(req.headers.authorization)
        if(!token) {
            res.status(StatusCodes.OK).json({message: "Error!Token was not provided."});
        }
        await AuthTokenBlackList.create({token})
        res.status(StatusCodes.OK).json();
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err})
    }
})

module.exports = {
    signIn,
    signOut,
    register,
    invalidateJWT
}