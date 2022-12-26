import mongoose, { Schema } from "mongoose";

export interface IToken {
    token: string
    _id: string
}

const TokenSchema = new Schema<IToken>({
    token: String,
})


module.exports = {
    AuthTokenBlackList: mongoose.model<IToken>('AuthTokenBlackList', TokenSchema),
}
