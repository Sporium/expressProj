const express = require('express')
const router = express.Router()

const {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/tasks.controller')

router.route('/tasks/').get(getAllTasks).post(createTask)
router.route('/tasks/:id').get(getTask).put(updateTask).delete(deleteTask)

const {
    signIn,
    signOut,
    register
} = require('../controllers/auth.controller')

router.route('/auth/signin').post(signIn)
router.route('/auth/signout').post(signOut)
router.route('/auth/register').post(register)

module.exports =  router