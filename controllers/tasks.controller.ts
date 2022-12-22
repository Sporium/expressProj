import {Request, Response} from 'express'
import {ITask} from "../models/task.model";
const Task = require('../models/task.model')


export interface ApiRequestInterface<T,Req = {}> extends Request<Req> {
    body: T
}

export type TaskParamsType = {
    id: string | number
}

const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({})
        res.status(200).json({ tasks })
    }
    catch (e) {
        res.status(500).json(e)
    }
}

const createTask = async (req: ApiRequestInterface<ITask>, res: Response) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({task})
    }
    catch (e) {
        res.status(500).json(e)
    }
}

const getTask = async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    try {
        const taskId = req.params.id
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
        return res.status(404).json(`Task ${taskId} not found`)
        }
        res.status(200).json({ task })
    }
    catch (e) {
        res.status(500).json(e)
    }
}
const updateTask = async (req: ApiRequestInterface<ITask,TaskParamsType>, res: Response) => {
    try {
        const taskId = req.params.id
        const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            return res.status(404).json(`Task ${taskId} not found`)
        }
        res.status(200).json({ task })
    }
    catch (e) {
        res.status(500).json(e)
    }
}
const deleteTask = async (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    try {
        const taskId = req.params.id
        const task = await Task.findOneAndDelete({ _id: taskId })
        if (!task) {
            return res.status(404).json(`Task ${taskId} not found`)
        }
        res.status(200).json({ status: 'success' })
    }
    catch (e) {
        res.status(500).json(e)
    }
}

module .exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}