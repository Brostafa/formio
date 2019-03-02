const express = require('express')
const router = express.Router()
const { putHandler } = require('../controllers/submission')

router
	.put('/submission', putHandler)

module.exports = router