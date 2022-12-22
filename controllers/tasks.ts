import {Request, Response} from 'express'


const getAllTasks = (req: Request, res: Response) => {
    res.send('All tasks controller')
}
const createTask = (req: Request, res: Response) => {
    res.send('createTask')
}
const getTask = (req: Request, res: Response) => {
    res.send('getTask')
}
const updateTask = (req: Request, res: Response) => {
    res.send('updateTask')
}
const deleteTask = (req: Request, res: Response) => {
    res.send('deleteTask')
}

module .exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}