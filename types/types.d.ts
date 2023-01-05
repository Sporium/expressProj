import {Request} from "express";

export interface IErrorResponse {
    message: {
        [key: string]: any
    }
    | string
}

export interface ApiRequestInterface<ReqDictionary = {}, ResBody = {}, ReqBody = {}, ReqQuery = {}> extends
    Request<ReqDictionary, ResBody, ReqBody, ReqQuery> {}
