import {NextFunction, Request, Response} from 'express'
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
        const tasks = Task.find({})
        res.status(200).json({ tasks })
})

const createTask = asyncWrapper (async (req: ApiRequestInterface<ITask>, res: Response) => {
        const task = await Task.create(req.body)
        res.status(201).json({task})
})

const getTask = asyncWrapper( async (req: ApiRequestInterface<{},TaskParamsType>, res: Response, next: NextFunction) => {
        const taskId = req.params.id
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            return createCustomError(`No task with id : ${taskId}`, StatusCodes.NOT_FOUND)
        }
        res.status(200).json({ task })
})
const updateTask = asyncWrapper(async (req: ApiRequestInterface<ITask,TaskParamsType>, res: Response) => {
        const taskId = req.params.id
        const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            return res.status(404).json(`Task ${taskId} not found`)
        }
        res.status(200).json({ task })
})
const deleteTask = asyncWrapper(async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
        const taskId = req.params.id
        const task = await Task.findOneAndDelete({ _id: taskId })
        if (!task) {
            return res.status(404).json(`Task ${taskId} not found`)
         }
        res.status(200).json({ status: 'success' })
})

module .exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}