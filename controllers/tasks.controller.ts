import { Request, Response} from 'express'
import {ITask} from "../models/task.model";
import {StatusCodes} from "http-status-codes";
const Task = require('../models/task.model')
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
        res.status(StatusCodes.OK).json({ tasks })
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
    }
})

const createTask = asyncWrapper (async (req: ApiRequestInterface<ITask>, res: Response) => {
        const task = await Task.create(req.body)
        res.status(StatusCodes.CREATED).json({task})
})

const getTask = asyncWrapper( async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOne({_id: taskId}).exec((error: ErrorCallback, task: TaskParamsType | undefined) => {
        if (task) {
            res.status(StatusCodes.OK).json({task})
        } else {
            res.status(StatusCodes.NOT_FOUND).send({message: `No task with id : ${taskId}`});
        }
    });
})
const updateTask = asyncWrapper(async (req: ApiRequestInterface<ITask,TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOneAndUpdate({ _id: taskId }, req.body, {
        new: true,
        runValidators: true
    }).exec((error: ErrorCallback, task: TaskParamsType | undefined) => {
        if (task) {
            res.status(StatusCodes.OK).json({task})
        } else {
            res.status(StatusCodes.NOT_FOUND).send({message: `No task with id : ${taskId}`});
        }
    });
})

const deleteTask = asyncWrapper(async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    const taskId = req.params.id
    return Task.findOneAndDelete({ _id: taskId }).exec((error: ErrorCallback, task: TaskParamsType | undefined) => {
            if (task) {
                res.status(StatusCodes.OK).json({task})
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
    deleteTask
}