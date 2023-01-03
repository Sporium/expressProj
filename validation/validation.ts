import {check} from "express-validator";

export const taskValidationRules = [
    check("name")
        .exists().withMessage('Name is required field')
        .isLength({ min: 2, max: 200 })
        .withMessage("Task should contain min 2 and max 200 symbols")
]
export const registerValidationRules = [
    check("password")
        .isLength({ min: 2, max: 15 })
        .withMessage("your password should have min and max length between 8-15")
]