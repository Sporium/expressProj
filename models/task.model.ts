import mongoose, { Document, Schema, Model } from "mongoose";


export interface ITask {
    name: string,
    completed: boolean
}

export interface ITaskDocument extends ITask, Document {}
export interface ITaskModel extends Model<ITaskDocument> {}


const TaskSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'], maxLength: 200 },
    completed: { type: Boolean, default: false },
})

module.exports = mongoose.model<ITaskDocument, ITaskModel>('Task', TaskSchema)
