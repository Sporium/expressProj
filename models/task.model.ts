import mongoose, { Schema } from "mongoose";
import Mongoose from "mongoose";

const taskResource = require('../resources/task.resource')

export interface ITask {
    name: string,
    completed: boolean,
}

export interface ITaskDocument extends ITask, Mongoose.Document {
    id: string
}


const TaskSchema = new Schema<ITaskDocument>({
    name: { type: String, required: [true, 'Name is required'], maxLength: 200 },
    completed: { type: Boolean, default: false },
})

const tasksCollection = (tasks: ITaskDocument[]) => {
    return tasks.map(task => taskResource(task))
}

module.exports = {
    Task: mongoose.model<ITaskDocument>('Task', TaskSchema),
    tasksCollection
}
