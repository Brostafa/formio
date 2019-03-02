const logger = require('./logger')
const request = require('request-promise')

const { FORMIO_APP_URL } = process.env

/**
 * Get FormIO submission
 * 
 * @param {String} submissionId FormIO submission id
 * @returns {Promise}
 */
const getSubmission = async submissionId => {
	try {
		const submission = await request(`${FORMIO_APP_URL}/submission/${submissionId}`, {
			headers: {
				'x-token': process.env.FORMIO_API_KEY
			}
		})

		return JSON.parse(submission)
	} catch (e) {
		logger.warn(`[Get Submission] failed to get formio submission with id=${submissionId}. err: `, e.message)

		return null
	}
}

/**
 * Update a submission in FormIO
 * 
 * @param {Object} opts 
 * @param {String} opts.submissionId FormIO submission id
 * @param {String} opts.sid FormIO submission id (visible to FormIO user)
 * @param {String} opts.description submission description
 * @param {Number} opts.amount submission amount
 * @param {String} opts.location user location
 * @param {String} opts.userAgent user useragent
 * @param {String} opts.timezone user timezone
 * @param {String} opts.webhookResponse stringified JSON
 * @returns {Boolean} true on success || false on failure
 */
const updateSubmission = async ({ submissionId, ...data }) => {
	// first we need to get the submission because in FormIO
	// if you updated a submission without providing all data
	// then it will make other data as null
	const submission = await getSubmission(submissionId)

	if (submission) {
		return request.put(`${FORMIO_APP_URL}/submission/${submissionId}`, {
			json: {
				data: {
					// add old submission data
					...submission.data,
					// override new values
					...data
				}
			},
			headers: {
				'x-token': process.env.FORMIO_API_KEY
			}
		}).catch(e => {
			if (typeof e.response.body === 'string') {
				// ignore error where we have a response with string
				// as I think it comes from having a trial version
	
				return true
			} else {
				logger.warn(`[Update Submission] an error occurred with submission id=${submissionId}`, e.response.body, e.statusCode)
	
				return false
			}
		})
	} else {
		// submission was not found
		return false
	}
}

module.exports = {
	getSubmission,
	updateSubmission
}