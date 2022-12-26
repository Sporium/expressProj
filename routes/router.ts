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

const taskValidationRules = [
    check("name")
        .exists().withMessage('Name is required field')
        .isLength({ min: 2, max: 200 })
        .withMessage("Task should contain min 2 and max 200 symbols")
]

router.route('/tasks/').get(getAllTasks).post([authenticateJWT, taskValidationRules, createTask])
router.route('/tasks/:id').get(getTask).put([authenticateJWT, taskValidationRules, updateTask]).delete([authenticateJWT,deleteTask])

const {
    signIn,
    signOut,
    register,
    invalidateJWT,
} = require('../controllers/auth.controller')

const registerValidationRules = [
    check("password")
        .isLength({ min: 2, max: 15 })
        .withMessage("your password should have min and max length between 8-15")
]

router.route('/auth/signin').post(signIn)
router.route('/auth/signout').post([authenticateJWT,signOut])
router.route('/auth/register').post(registerValidationRules,  register)
router.route('/auth/invalidate-token').post([authenticateJWT, invalidateJWT])

module.exports =  router