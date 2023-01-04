import {Response} from "express";
import {ApiRequestInterface} from "../controllers/tasks.controller";
import {publicImages} from "../config/constants";
import {StatusCodes} from "http-status-codes";
import {readFile, writeFile} from "fs/promises";
import {resolve} from "path";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;

const asyncWrapper = require('../middleware/async')
const fs = require('fs')
const sharp = require('sharp')
const s3 = require('../config/aws-config')

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
    filename: string
    format: ImageFormatType
    [key: string]: any
}
const formSize = (data: ResizeQuery): {format: ImageFormatType, width: number, height: number } => {
    const defaultSize = '200'
    const width = parseInt(data.width || defaultSize)
    const height = parseInt(data.height || defaultSize)
    return {format: data.format, width, height}
}

const addWatermark = async (filePath: string) => {
    const watermark = sharp(await readFile(filePath)).composite([
        {input: await readFile(resolve(`${publicImages}watermark.png`)), left: 40, top:  20}
    ]).png().toBuffer()
    await writeFile(resolve(filePath), await watermark)
}

const resizeImage = asyncWrapper(async (req: ApiRequestInterface<{}, {}, {}, ResizeQuery>, res: Response) => {
    const { width, height, format } = formSize(req.query)
    fs.access(publicImages+req.query.filename, fs.F_OK, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json('File does not exist')
            return;
        } else {
            res.type(`image/${format || 'png'}`)
            resize(publicImages+req.query.filename, format, width, height).pipe(res)

        }
    })

})

const getFileList = asyncWrapper(async (req: ApiRequestInterface, res: Response) => {
  await fs.readdir(publicImages, function (err: (NodeJS.ErrnoException | null), files: string[]) {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({})
        }
        res.status(StatusCodes.OK).json(files)
  });
})

interface ImageRequestI extends ApiRequestInterface<{},{},{}, ResizeQuery> {
    file: Express.Multer.File
}

const uploadImage = asyncWrapper(async (req: ImageRequestI, res: Response) => {
    const image = req.file;
    if (!image) return res.sendStatus(StatusCodes.BAD_REQUEST).json({message: "Please upload image"});
    if (!/^image/.test(image.mimetype)) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    const filePath = image.path + '.png'
    fs.rename(image.path, filePath, () => {
        console.log("\nFile Renamed!\n");
    });
    if (Object.keys(req.query).length) {
        const {width, height, format} = formSize(req.query)
        res.type(`image/${format || 'png'}`)
        await addWatermark(filePath)
        resize(filePath, 'png', width, height).pipe(res)
    } else {
        res.sendStatus(StatusCodes.OK).json({});
    }
})

const uploadToAWS = asyncWrapper(async (req: ImageRequestI, res: Response) => {
    const image  = req.file;
    if (!image) return res.sendStatus(StatusCodes.BAD_REQUEST).json({message: "Please upload image"});
    if (!/^image/.test(image.mimetype)) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    const filePath = image.path + '.png'
    fs.rename(image.path,filePath ,() => {
        console.log("\nFile Renamed!\n");
    });
    await addWatermark(filePath)
    const fileToupload = fs.createReadStream(filePath)
    const uploadParams = {
        Bucket: 'nodeprojbucket',
        Key: filePath,
        Body: fileToupload,
        ContentType: 'image/png',
        ACL: 'public-read'
    }
    s3.upload(uploadParams, function (err: Error, data: SendData) {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({err})
        }
        else {
            res.status(StatusCodes.OK).json({location: data.Location})
        }
    })
})

module.exports = {
    resizeImage,
    uploadImage,
    getFileList,
    uploadToAWS,
}