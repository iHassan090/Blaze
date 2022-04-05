const express = require('express')
const userRouter = require('./routers/UserRouter')
const User = require('./models/User')
require('./db/mongoose')


const app = express()
app.use(express.json())
app.use(userRouter)

app.listen(3000, () => {
    console.log("Running on PORT 3000")
})