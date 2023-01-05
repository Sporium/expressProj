import {UserDocument} from "../models/user.model";

export interface IUserResource extends Pick<UserDocument, 'name' | 'id'> {
    token?: string
}
// export interface IUserResource {
//     token?: string
//     name: string
//     id: string
// }

type UserResourceF = (user: UserDocument, token?: string) => IUserResource

function userResource(user: UserDocument, token?: string): IUserResource {
    return {
        name: user.name,
        id: user._id,
        token
    }
}

module.exports = userResource