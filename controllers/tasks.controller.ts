import { Request, Response} from 'express'
import {ITask, ITaskModel} from "../models/task.model";
import {StatusCodes} from "http-status-codes";
import {getTokenFromHeader} from "../helpers/helpers";
import jwt, {JwtPayload} from "jsonwebtoken";
const {Task, tasksCollection} = require('../models/task.model')
const {User} = require('../models/user.model')
const taskResource = require('../resources/task.resource')
const asyncWrapper = require('../middleware/async')

export interface ApiRequestInterface<T,Req = {}> extends Request<Req> {
    body: T
}

export type TaskParamsType = {
    id: string | number
}

const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({})
        res.status(StatusCodes.OK).json(tasksCollection(tasks))
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
    }
})

const createTask = asyncWrapper (async (req: ApiRequestInterface<ITask>, res: Response) => {
    try {
        await Task.validate(req.body)
        const task = await Task.create(req.body)
        const token = jwt.decode(getTokenFromHeader(req.headers.authorization)) as JwtPayload
        await User.findOneAndUpdate({ _id: token.id }, {$push: {tasks: task._id}}, { new: true, useFindAndModify: true });  //update users relation
        res.status(StatusCodes.CREATED).json(taskResource(task))
    }
    catch (e) {
        const err = e as Error
        res.status(StatusCodes.BAD_REQUEST).json(err.errors['name'].message)
    }
})

const getTask = asyncWrapper( async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOne({_id: taskId}).exec((error: ErrorCallback, task: ITaskModel | undefined) => {
        if (task) {
            res.status(StatusCodes.OK).json(taskResource(task))
        } else {
            res.status(StatusCodes.NOT_FOUND).json({message: `No task with id : ${taskId}`});
        }
    });
})

const getTaskByUser = asyncWrapper( async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    if (req.query.id) {
        try {
            const userTasks = await User.findOne({_id: req.query.id}).populate('tasks');
            res.status(StatusCodes.OK).json(userTasks.tasks)
        }
        catch (e) {
            res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
        }
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json({ message:"Please pass id of the user"})
    }
})

const updateTask = asyncWrapper(async (req: ApiRequestInterface<ITask,TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOneAndUpdate({ _id: taskId }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    }).exec((error: ErrorCallback, task: ITaskModel | undefined) => {
        if (task) {
            res.status(StatusCodes.OK).json(taskResource(task))
        } else {
            res.status(StatusCodes.NOT_FOUND).send({message: `No task with id : ${taskId}`});
        }
    });
})

const deleteTask = asyncWrapper(async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOneAndDelete({ _id: taskId }).exec( async (error: ErrorCallback, task: ITaskModel | undefined) => {
            if (task) {
                const token = jwt.decode(getTokenFromHeader(req.headers.authorization)) as JwtPayload
                User.findOneAndUpdate({ _id: token.id }, {$pull: {tasks: task._id}}, { new: true, useFindAndModify: true }); //update users relation
                res.status(StatusCodes.OK).json(taskResource(task))
            } else {
                res.status(StatusCodes.NOT_FOUND).send({message: `No task with id : ${taskId}`});
            }
    });
})

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTaskByUser
}