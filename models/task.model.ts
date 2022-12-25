import mongoose, { Schema } from "mongoose";

const taskResource = require('../resources/task.resource')

export interface ITask {
    name: string,
    completed: boolean,
    id: string
}

export interface ITaskModel extends ITask {
    _id: string,
    __v: number
}


const TaskSchema = new Schema<ITask>({
    name: { type: String, required: [true, 'Name is required'], maxLength: 200 },
    completed: { type: Boolean, default: false },
})

const tasksCollection = (tasks: ITask[]) => {
    return tasks.map(task => taskResource(task))
}

module.exports = {
    Task: mongoose.model<ITask>('Task', TaskSchema),
    tasksCollection
}
