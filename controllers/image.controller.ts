import {Response} from "express";
import {ApiRequestInterface} from "../controllers/tasks.controller";
import {publicImages} from "../config/constants";

const asyncWrapper = require('../middleware/async')
const fs = require('fs')
const sharp = require('sharp')

type ImageFormatType = 'png'

const resize = (path: string, format: ImageFormatType, width: number, height: number) => {
    const readStream = fs.createReadStream(path)
    let transform = sharp()

    if (format) {
        transform = transform.toFormat(format)
    }

    if (width || height) {
        transform = transform.resize(width, height)
    }

    return readStream.pipe(transform)
}


interface ResizeQuery  {
    width: string
    height: string
    format: ImageFormatType
    [key: string]: any
}
const resizeImage = asyncWrapper(async (req: ApiRequestInterface<{}, {}, {}, ResizeQuery>, res: Response) => {
    const defaultSize = '200'
    const width = parseInt(req.query.width || defaultSize)
    const height = parseInt(req.query.height || defaultSize)
    const format = req.query.format

    res.type(`image/${format || 'png'}`)
    resize(publicImages+'nodejs.png', format, width, height).pipe(res)
})

module.exports = {
    resizeImage
}