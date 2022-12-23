import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const asyncWrapper = require('../middleware/async')

interface User {
    name: string
    id: string | number
}

const signIn = asyncWrapper(async (req: Request, res: Response<User | Error>) => {
    try {
        res.status(StatusCodes.OK).json({
            id: 1,
            name: 'john'
        })
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
})

const register = asyncWrapper(async (req: Request, res: Response<User | Error>) => {
    try {
        res.status(StatusCodes.OK).json({
            name: 'new user',
            id: 'tempId'
        })
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
})

const signOut = asyncWrapper(async (req: Request, res: Response<{} | Error>) => {
    try {
        res.status(StatusCodes.OK).json({})
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