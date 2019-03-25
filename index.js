require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./routes')
const hbs = require( 'express-handlebars')
const logger = require('./libs/logger')

const PORT = process.env.PORT || 8080

// serve static files in public folder
app.engine('hbs', hbs({
	extname: 'hbs',
}))
app.set('view engine', 'hbs')

app.use(router)
app.listen(PORT, () => logger.success(`Listening on port :${PORT}`))