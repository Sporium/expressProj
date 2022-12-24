import mongoose, { Schema } from "mongoose";

export interface IUser {
    name: string
    id: string | number
    token?: string
}

export interface IUserModel extends IUser, Document {
    _id: string,
    __v: number
    password: string
}


const UserSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'], maxLength: 20, unique: true },
    password: { type: String, required: [true, 'Password is required']},
})


module.exports = {
    User: mongoose.model<IUserModel>('User', UserSchema),
}
