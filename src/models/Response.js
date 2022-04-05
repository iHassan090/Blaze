class Response {
    constructor(returnCode, returnType, returnMessage, returnData) {
        this.returnCode = returnCode
        this.returnType = returnType
        this.returnMessage = returnMessage
        this.returnData = returnData
    }
    static getFieldRequiredMessage(field) {
        return field + ' is missing or is empty.'
    }
    static getValidationError(e) {
        let errors = {};

        Object.keys(e.errors).forEach((key) => {
            errors[key] = e.errors[key].message;
        });
        return errors[Object.keys(errors)[0]]
    }
}

module.exports = Response