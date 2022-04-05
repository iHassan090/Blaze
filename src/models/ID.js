const mongoose = require('mongoose')

const idSchema = mongoose.Schema({
    maxID: {
        type: Number,
        required: true
    }
})

const ID = mongoose.model('ID', idSchema)

module.exports = ID