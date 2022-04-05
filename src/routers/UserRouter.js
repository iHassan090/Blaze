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

        return res.send(new Response(status, "SUCCESS", "OTP Sent Successfully", { otp }))
    } catch (e) {
        if (e.name === "ValidationError")
            return res.send(new Response(400, "FAILURE", Response.getValidationError(e)))

        return res.send(new Response(400, "FAILURE", "Something went wrong, Please try again later."))
    }
})


module.exports = router