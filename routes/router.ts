const express = require('express')
const router = express.Router()

const { check } = require("express-validator");
const authenticateJWT = require('../middleware/jwtAuth')


const {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/tasks.controller')

router.route('/tasks/').get(getAllTasks).post([authenticateJWT,createTask])
router.route('/tasks/:id').get(getTask).put([authenticateJWT,updateTask]).delete([authenticateJWT,deleteTask])

const {
    signIn,
    signOut,
    register,
} = require('../controllers/auth.controller')

const registerValidationRules = [
    check("password")
        .isLength({ min: 2, max: 15 })
        .withMessage("your password should have min and max length between 8-15")
]

router.route('/auth/signin').post(signIn)
router.route('/auth/signout').post([authenticateJWT,signOut])
router.route('/auth/register').post(registerValidationRules,  register)

module.exports =  router