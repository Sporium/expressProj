import {Request, Response} from 'express'

const getAllTasks = (req: Request, res: Response) => {
    res.send('All tasks controller')
}

export interface ApiRequestInterface<T,Req = {}> extends Request<Req> {
    body: T
}

type TaskType = {
    name: string,
    completed: boolean
}
export type TaskParamsType = {
    id: string | number
}


const createTask = (req: ApiRequestInterface<TaskType>, res: Response) => {
    res.json(req.body)
}

const getTask = (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    res.json({ id: req.params.id })
}
const updateTask = (req: ApiRequestInterface<TaskType,TaskParamsType>, res: Response) => {
    res.json({ ...req.body, id: req.params.id })
}
const deleteTask = (req: ApiRequestInterface<{},TaskParamsType>, res: Response) => {
    res.json({ id: req.params.id })
}

module .exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}