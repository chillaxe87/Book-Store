const express = require('express')
const cors = require('cors')
const path = require('path')
const userRouter = require('./routers/userRouter')
const bookRouter = require('./routers/bookRouter')
const adminRouter = require('./routers/adminRouter')
const publicDirectoryPath = path.join(__dirname, '../public')

const port = process.env.PORT
require('./db/mongoose');

const app = express()

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(bookRouter)
app.use(adminRouter)
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server is up on port', port)
})