require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./routes')
const logger = require('./libs/logger')

const PORT = process.env.PORT || 8080
require('./libs/wampei-api')
app.use(router)

app.listen(PORT, () => logger.success(`Listening on port :${PORT}`))