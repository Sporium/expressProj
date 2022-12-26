import jwt from "jsonwebtoken";
import {IToken} from "../models/token.model";
import {JWT_KEY} from "../config/constants";

const cron = require("node-cron");
const {AuthTokenBlackList} = require('../models/token.model')

const scheduler = () => {
    cron.schedule("0 */2 * * *", async function () {
        const expiredTokens: {_id: string}[] = []
       await AuthTokenBlackList.find({}).then((tokenList: IToken[]) => {
            tokenList.map(tok => {
                jwt.verify(tok.token, JWT_KEY || '', (err:  jwt.VerifyErrors | null) => {
                    if (err) {
                        expiredTokens.push({_id: tok._id})
                    }
                    return err
                })
            })
        })
        if (expiredTokens.length) {
            AuthTokenBlackList.deleteMany({$or: expiredTokens})
        }
    });
}

module.exports = scheduler