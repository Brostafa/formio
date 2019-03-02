const request = require('request-promise')
const logger = require('../libs/logger')
const { updateSubmission } = require('../libs/formio-api')

const putHandler = async (req, res) => {
	res.send('ok')

	const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress
	const submissionId = req.query['id']

	try {
		const ipData = await request(`http://ip-api.com/json/${ipAddress}`)
		const { country, status } = JSON.parse(ipData)

		if (status === 'success') {
			updateSubmission({
				submissionId,
				country,
				ipAddress
			})
		} else {
			logger.warn(`[API] PUT /submission failed to get user data for ip = ${ipAddress}`, ipData)
		}
	} catch (e) {
		logger.error(`[API] PUT /submission an error occurred`, e)
	}
}

module.exports = {
	putHandler
}