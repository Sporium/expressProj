import mongoose from "mongoose";

const connectDB = (url: string) => {
    return mongoose.connect(
        url,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: true,
        } as mongoose.ConnectOptions
    )
}

module.exports = connectDB