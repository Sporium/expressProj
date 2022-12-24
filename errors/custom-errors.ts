interface Error {
    statusCode: number;
    errors: {
        [key: string]: {
            name: string,
            message: string,
            properties: {
                message: string,
                type: string,
                path: string
            },
            kind: string,
            path: string
        }
    }
    code: number,
    keyValue: {
        [key: string]: string
    }
}

class CustomAPIError extends Error {
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (msg: string, statusCode: number) => {
    return new CustomAPIError(msg, statusCode)
}

module.exports = { createCustomError, CustomAPIError }
