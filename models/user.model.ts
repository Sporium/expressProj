import mongoose, { Schema } from "mongoose";
import * as Mongoose from "mongoose";

export interface IUser {
    name: string
    authTokens?: string[]
    password: string
}
export interface UserDocument extends IUser, Mongoose.Document {
    id: string | number
}


const UserSchema = new Schema<UserDocument>({
    name: { type: String, required: [true, 'Name is required'], maxLength: 20, unique: true },
    password: { type: String, required: [true, 'Password is required']},
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }]
})


module.exports = {
    User: mongoose.model<UserDocument>('User', UserSchema),
}
