const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const compression = require('compression')
const helemt = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const logger = require('../libs/logger')
// Routes
const bitcoinRouter  = require('./bitcoin')
const submissionRouter = require('./submission')

const morganFormat = `:remote-addr - :remote-user :method :url :status :res[content-length] :referrer :user-agent`

router.use(morgan(morganFormat, {
	skip: (req, res) => res.statusCode < 400 || res.statusCode > 499,
	stream: logger.morganWarn,
}))

router.use(morgan(morganFormat, {
	skip: (req, res) => res.statusCode < 500,
	stream: logger.morganError,
}))

if (process.env.NODE_ENV === 'development') {
	router.use(morgan(morganFormat, {
		skip: (req, res) => res.statusCode > 400,
		stream: logger.morganInfo
	}))
}

// parse JSON requests
router.use(bodyParser.json())
// parse multi-part/form requests
router.use(bodyParser.urlencoded({ extended: false }))
// enable gzip compression
router.use(compression())
// add some secure headers
router.use(helemt({
	frameguard: false
}))
// enable cross-origin requests
router.use(cors())
router.use(bitcoinRouter)
router.use(submissionRouter)
// serve our form
router.get('/', (req, res) => {
	res.render('form', {
		FORMIO_APP_URL: process.env.FORMIO_APP_URL,
		layout: false
	})
})

 

module.exports = router