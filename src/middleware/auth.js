const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Response = require('../models/Response')

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, '1ctiv5')
        const user = User.findOne({ _id: decoded._id })

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.send(new Response(401, "FAILURE", "You are not authorized to perform this action."))
    }
}

module.exports = auth