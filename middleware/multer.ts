import {FileFilterCallback} from "multer";
import {StatusCodes} from "http-status-codes";
import {NextFunction} from "express";
import {Response} from "express";

const multer = require('multer');
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]
const multerUploader = multer({dest: 'public/images',
    limits: { fieldSize: 20000},
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('file is not allowed'))
        }
        cb(null, true)
    }
});

const uploadSave = multerUploader.single('image');

const upload =  (req: Request, res: Response, next: NextFunction) => {
    uploadSave(req, res, function (err: Error) {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({message: "Wrong file mimetype"});
        }
        next()
    })}

module.exports = upload