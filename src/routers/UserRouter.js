const express = require('express')
const User = require('../models/User')
const Response = require('../models/Response')
const auth = require('../middleware/auth')

const router = new express.Router()


router.post('/sendOTP', async (req, res) => {
    const phoneNumber = req.body.phoneNumber
    if (!phoneNumber)
        return res.send(new Response(400, "FAILURE", Response.getFieldRequiredMessage('phoneNumber')))
    try {
        let user = await User.findOne({ phoneNumber })
        let status = 200
        if (!user) {
            status = 201
            user = new User(req.body)
            await user.generateUserID()
        }

        // TODO Remove OTP after service provider has been implemented.
        const otp = await user.generateOTP()
        const token = await user.generateAuthToken()

        return res.send(new Response(status, "SUCCESS", "OTP Sent Successfully", { otp, token }))
    } catch (e) {
        if (e.name === "ValidationError")
            return res.send(new Response(400, "FAILURE", Response.getValidationError(e)))

        return res.send(new Response(400, "FAILURE", "Something went wrong, Please try again later."))
    }
})

router.post('/verifyOTP', auth, (req, res) => {
    const otp = req.body.otp
    const user = req.user
    if (!otp)
        return res.send(new Response(400, "FAILURE", Response.getFieldRequiredMessage('otp')))

    if (user.otp.code === otp) {
        if (user.otp.expireTime >= new Date())
            res.send(new Response(200, "SUCCESS", "OTP Verified Successfully.", user.getObject()))
        else
            res.send(new Response(400, "FAILURE", "Your OTP has expired."))
        user.removeOTP()
    } else
        return res.send(new Response(400, "FAILURE", "Incorrect OTP provided."))
})


module.exports = router