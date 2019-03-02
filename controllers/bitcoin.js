const { updateSubmission } = require('../libs/formio-api')
const { createInvoice } = require('../libs/wampei-api')

/**
 * FORM.IO Webhook receiver
 * this also updates webhookResponse field on FORM.IO
 * 
 * @param {Object} req Express Request
 * @param {Object} req.body Request body data
 * @param {Object} req.body.submission FORM.IO webhook submission data
 * @param {String} req.body.submission.id submission id
 * @param {String} req.body.submission.data submission data
 * @param {String} req.body.submission.data.description submission description
 * @param {Number} req.body.submission.data.amount submission amount
 * @param {Object} res Express Response
 */
const postHandler = async (req, res) => {
	try {
		const formioRequest = req.body.submission
		const { _id, data: { amount, description }, metadata: { timezone, userAgent } } = formioRequest
		const invoice = await createInvoice(amount, description)

		if (invoice) {
			await updateSubmission({
				submissionId: _id,
				sid: _id,
				webhookResponse: JSON.stringify(invoice),
				timezone,
				useragent: userAgent
			})

			res.send(invoice)	
		} else {
			res.status(422).send(`Failed to create an invoice`)
		}
	} catch (e) {
		console.log(`[API] POST /bitcoin internal server error:`, e)
		res.status(500).send(`Internal server error with webhook receiver. Date: ${new Date()}`)
	}
}

module.exports = {
	postHandler,
}