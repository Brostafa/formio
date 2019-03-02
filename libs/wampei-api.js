const request = require('request-promise')
const logger = require('./logger')

const {
	WAMPEI_REGISTER_URL,
	WAMPEI_USERNAME,
	WAMPEI_PASSWORD
} = process.env


// curl -d usd=5 -d dec=russell -u : WAMPEI
const createInvoice = async (amount, description) => {
	try {
		logger.info(`[Create Invoice] creating invoice, amount=${amount} | description="${description}"`)

		const response = await request.post(`${WAMPEI_REGISTER_URL}/invoice/remote/terminal/json`, {
			form: {
				usd: amount,
				amount,
				dec: description
			},
			auth: {
				user: WAMPEI_USERNAME,
				pass: WAMPEI_PASSWORD
			},
			resolveWithFullResponse: true
		})

		const responseIsHTML = !!response.headers['content-type'].match('/html')

		if (responseIsHTML) {
			logger.warn(`[Create Invoice] failed to create an invoice have you set WAMPEI_USERNAME and WAMPEI_PASSWORD? amount=${amount} | description=${description}`)
			
			return false
		} else {
			logger.success(`[Create Invoice] created invoice successfully! response: ${response.body}`)

			return JSON.parse(response.body)
		}
		// return response
	} catch (e) {
		logger.error(`[Create Invoice] Error occurred while creating an invoice, amount=${amount} | description=${description} | err:`, e.message)

		return false
	}
}

module.exports = {
	createInvoice
}