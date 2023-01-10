import {FileFilterCallback} from "multer";

const multer = require('multer');
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]
const upload = multer({dest: 'public/images',
    limits: { fieldSize: 20000},
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('file is not allowed'))
        }
        cb(null, true)
    }
});

module.exports = upload