const express = require('express')
const router = express.Router()
const { postHandler } = require('../controllers/bitcoin')

router
	.post('/bitcoin', postHandler)

module.exports = router