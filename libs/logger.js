
const { Signale } = require('signale')

const loggerOptions = {
	config: {
		displayDate: true,
		displayTimestamp: true,
		displayBadge: false,
		displayScope: true
	}
}
const logger = new Signale(loggerOptions)

logger.morganInfo = {
	write: (message) => {
		logger.info('[API]', message)
	}
}
logger.morganWarn = {
	write: (message) => {
		logger.warn('[API]', message)
	}
}
logger.morganError = {
	write: (message) => {
		logger.error('[API]', message)
	}
}

module.exports = logger