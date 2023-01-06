import {Response} from "express";
import {AWS_BUCKET_NAME, publicImages} from "../config/constants";
import {StatusCodes} from "http-status-codes";
import {readFile, writeFile} from "fs/promises";
import {resolve} from "path";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {ApiRequestInterface, IErrorResponse} from "../types/types";
import {AWSError} from "aws-sdk";
import {ListObjectsV2Output} from "aws-sdk/clients/s3";

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

const getFilePath = (req: ImageRequestI, res: Response): string => {
    const image  = req.file;
    if (!image)  {
        res.status(StatusCodes.BAD_REQUEST).json({message: "Please upload image"});
    }
    if (!/^image/.test(image.mimetype)) {
        res.status(StatusCodes.BAD_REQUEST);
    }
    console.log(req.file,'image.path')
    const filePath = image.path + '.png'
    fs.rename(image.path,filePath ,() => {
        console.log("\nFile Renamed!\n");
    });
    return filePath
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

const resizeImage = asyncWrapper(async (req: ApiRequestInterface<{}, {}, {}, ResizeQuery>, res: Response<IErrorResponse>) => {
    const { width, height, format } = formSize(req.query)
    fs.access(publicImages+req.query.filename, fs.F_OK, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({message: 'File does not exist'})
            return;
        } else {
            res.type(`image/${format || 'png'}`)
            resize(publicImages+req.query.filename, format, width, height).pipe(res)

        }
    })

})
type StoredFileType = {isLocal: boolean, path: string}
const getLocalFiles = async (res: Response<IErrorResponse>, baseUrl: string): Promise<StoredFileType[]> => {
    return new Promise((resolve) => {
        fs.readdir(publicImages, function (err: (NodeJS.ErrnoException | null), files: string[]) {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({message: err})
            }
            return resolve(files?.map(file => {
                return {
                    isLocal: true,
                    path: `${baseUrl}/images/${file}`
                }
            }))
        });
    })
}
const getCloudFiles = async (res: Response<IErrorResponse>): Promise<StoredFileType[]> => {
    return new Promise((resolve) => {
        s3.listObjectsV2({Bucket: AWS_BUCKET_NAME}, function (err: AWSError,data: ListObjectsV2Output) {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({message: err})
            }
            if (data.Contents) {
                return resolve(data.Contents.map(file => {
                    return {
                        isLocal: false,
                        path: `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${file.Key}`
                    }
                }))
            }
        })
    })
}

const getFileList = asyncWrapper(async (req: ApiRequestInterface, res: Response<StoredFileType[] | IErrorResponse>) => {
    const fullUrl = req.protocol + '://' + req.get('host');
    let localFiles: StoredFileType[] = await getLocalFiles(res,fullUrl)
    let cloudFiles: StoredFileType[] = await getCloudFiles(res)
    res.status(StatusCodes.OK).json([...localFiles,...cloudFiles])
})

interface ImageRequestI extends ApiRequestInterface<{},{},{}, ResizeQuery> {
    file: Express.Multer.File
}

const uploadImage = asyncWrapper(async (req: ImageRequestI, res: Response<IErrorResponse>) => {
    const filePath = getFilePath(req, res)
    if (Object.keys(req.query).length) {
        const {width, height, format} = formSize(req.query)
        res.type(`image/${format || 'png'}`)
        await addWatermark(filePath)
        resize(filePath, 'png', width, height).pipe(res)
    } else {
        res.sendStatus(StatusCodes.OK).json();
    }
})

const uploadToAWS = asyncWrapper(async (req: ImageRequestI, res: Response<{location: SendData['Location']} | IErrorResponse>) => {
    const filePath = getFilePath(req, res)
    await addWatermark(filePath)
    const fileToupload = fs.createReadStream(filePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: filePath.replace('public/',''),
        Body: fileToupload,
        ContentType: 'image/png',
        ACL: 'public-read'
    }
    s3.upload(uploadParams, function (err: Error, data: SendData) {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({message: err})
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