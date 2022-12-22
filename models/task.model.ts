import mongoose, { Document, Schema } from "mongoose";

const taskService = require('../services/task.service')
export interface ITask {
    name: string,
    completed: boolean
}

export interface ITaskDocument extends ITask, Document {}
export interface ITaskModel extends ITask {
    _id: string,
    __v: number
}


const TaskSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'], maxLength: 200 },
    completed: { type: Boolean, default: false },
})

const tasksCollection = (tasks: ITask[]) => {
    return tasks.map(task => taskService(task))
}

module.exports = {
    Task: mongoose.model<ITaskDocument>('Task', TaskSchema),
    tasksCollection
}
