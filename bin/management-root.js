const config = require('config');
const { connect } = require('ljit-db/mongoose');
const logger = require('../server/lib/logger');
const { server } = require('../server/management');

connect(config.SERVER.MONGO.URL)
	.then(() => {
		server.listen(config.SERVER.MANAGEMENT.PORT, config.SERVER.MANAGEMENT.HOST, () => {
			const { address, port } = server.address();
			const url = `http://${address}:${port}`;

			logger.info(`server listening at ${url} with ${config.MODE} mode`);
		});
	})
	.catch(error => {
		logger.error(error);
		throw error;
	});
