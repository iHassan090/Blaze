const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Response = require('../models/Response')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, '1ctiv5')
        const user = await User.findOne({ _id: decoded._id })

        if (user == null)
            throw new Error()

        req.user = user
        req.token = token
        next()
    } catch (e) {
        return res.send(new Response(401, "FAILURE", "You are not authorized to perform this action."))
    }
}

module.exports = auth