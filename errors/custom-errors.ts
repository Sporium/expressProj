interface Error {
    statusCode: number;
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
