import {IUser, IUserModel} from "../models/user.model";

const userResource = (user: IUserModel): IUser => {
    return {
        name: user.name,
        id: user._id,
    }
}

module.exports = userResource