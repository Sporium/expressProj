import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ApiRequestInterface} from "../controllers/tasks.controller";
import {IUser, IUserModel} from "../models/user.model";
import {decodeToken, generateJWT, getTokenFromHeader} from "../helpers/helpers";

const {User, IUser} = require('../models/user.model')
const userResource = require('../resources/user.resource')

const asyncWrapper = require('../middleware/async')
const bcrypt = require("bcrypt")

async function generatePass(plaintextPassword: string) {
    return await bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword: string, hash: string) {
    return await bcrypt.compare(plaintextPassword, hash);
}


const signIn = asyncWrapper(async (req: Request, res: Response<typeof IUser | Error>) => {
    try {
        let { name, password } = req.body;
        let existingUser: IUserModel | null;
        existingUser = await User.findOne({ name });
        if (existingUser) {
            const isValid = await comparePassword(password, existingUser.password)
            const token = generateJWT(existingUser)
            if (isValid) {
                res.status(StatusCodes.OK).json({...userResource(existingUser), token})
            }
        }
        res.status(StatusCodes.BAD_REQUEST).json("Invalid username or password")
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
})

const register = asyncWrapper(async (req: ApiRequestInterface<IUserModel>, res: Response<typeof IUser | Error>) => {
    try {
        const pass = await generatePass(req.body.password)
        await User.init()
        const user = await User.create({
            name: req.body.name,
            password: pass
        })
        const token = generateJWT({id: user._id, name: user.name})
        res.status(StatusCodes.CREATED).json({...userResource(user), token})
    }
    catch (e) {
        const err = e as Error
        if (err.name === 'MongoError' && err.code === 11000) {
            const keys = Object.keys(err.keyValue)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(keys?.map(k => {
                return {
                    [k]: `This ${k} is already taken`
                }
            }))
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.name)
    }
})

const signOut = asyncWrapper(async (req: Request, res: Response<{} | Error>) => {
    try {
        const token = getTokenFromHeader(req.headers.authorization)
        if(!token) {
            res.status(200).json({success:false, message: "Error!Token was not provided."});
        }
        res.status(200).json({});
        }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
})

module.exports = {
    signIn,
    signOut,
    register
}