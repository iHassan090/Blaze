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
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, '1ctiv5')
    user.tokens = user.tokens.concat({ token })

    await user.save()

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
    const user = this
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expireTime = new Date()
    expireTime.setMinutes(expireTime.getMinutes() + 30)
    user.otp.expireTime = expireTime
    user.otp.code = otp
    await user.save()

    return otp
}


userSchema.statics.getObject = (user) => {
    const userObject = user.toObject()


    delete userObject._id
    delete userObject.otp
    delete userObject.tokens
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return userObject
}

const User = mongoose.model('User', userSchema)
module.exports = User