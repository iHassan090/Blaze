const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017'
const dbName = 'Blaze'
const connectionURL = url + '/' + dbName

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})