import {registerValidationRules, taskValidationRules} from "../validation/validation";
const express = require('express')
const router = express.Router()
const authenticateJWT = require('../middleware/jwtAuth')

const upload = require('../middleware/multer')

const {
    signIn,
    signOut,
    register,
    invalidateJWT,
} = require('../controllers/auth.controller')

const {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getTaskByUser
} = require('../controllers/tasks.controller')

const {
    resizeImage,
    uploadImage,
    getFileList,
    uploadToAWS,
} = require('../controllers/image.controller')


//task routes
router.route('/tasks/').get(getAllTasks).post([authenticateJWT, taskValidationRules, createTask])
router.route('/users-tasks').get(getTaskByUser)
router.route('/tasks/:id').get(getTask).put([authenticateJWT, taskValidationRules, updateTask]).delete([authenticateJWT,deleteTask])
//auth routes
router.route('/auth/signin').post(signIn)
router.route('/auth/signout').post([authenticateJWT,signOut])
router.route('/auth/register').post(registerValidationRules,  register)
router.route('/auth/invalidate-token').post([authenticateJWT, invalidateJWT])


router.route('/image/resize').get(resizeImage)
router.route('/image/upload').post([upload.single('image'),uploadImage])
router.route('/image/cloud-upload').post([upload.single('image'),uploadToAWS])
router.route('/image/filelist').get(getFileList)

module.exports =  router