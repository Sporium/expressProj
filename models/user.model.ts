import mongoose, { Schema } from "mongoose";

export interface IUser {
    name: string
    id: string | number
    authTokens?: string[]
}

export interface IUserModel extends IUser {
    _id: string,
    __v: number
    password: string
}


const UserSchema = new Schema<IUser>({
    name: { type: String, required: [true, 'Name is required'], maxLength: 20, unique: true },
    password: { type: String, required: [true, 'Password is required']},
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }]
})


module.exports = {
    User: mongoose.model<IUser>('User', UserSchema),
}
