const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const ID = require('./ID')

const userSchema = mongoose.Schema({
    userID: {
        type: Number
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Invalid Phone Number.")
            }
        }
    },
    otp: {
        code: {
            type: Number
        },
        expireTime: Date
    },
    avatar: {
        type: String
    },
    tokens: [{
        token: {
            authToken: {
                type: String
            },
            expireTime: {
                type: Date
            }
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
    const currentDate = new Date()
    const expireTime = currentDate.setFullYear(currentDate.getFullYear() + 1)
    const authToken = jwt.sign({ _id: this._id.toString() }, '1ctiv5')
    const token = {
        authToken,
        expireTime
    }
    this.tokens = this.tokens.concat({ token })

    await this.save()

    return token
}

userSchema.methods.generateUserID = async function () {
    const user = this
    let findResult = await ID.findOne()
    if (!findResult) {
        findResult = new ID()
        findResult.maxID = 10000
        await findResult.save()
    }

    findResult.maxID = findResult.maxID + 1
    await findResult.save()

    user.userID = findResult.maxID
}

userSchema.methods.generateOTP = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expireTime = new Date()
    expireTime.setMinutes(expireTime.getMinutes() + 30)
    this.otp.expireTime = expireTime
    this.otp.code = otp
    await this.save()

    return otp
}


userSchema.methods.getObject = function () {
    const userObject = this.toObject()

    delete userObject._id
    delete userObject.otp
    delete userObject.tokens
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return userObject
}

userSchema.methods.removeOTP = async function () {
    this.otp = undefined
    await this.save()
}

const User = mongoose.model('User', userSchema)
module.exports = User