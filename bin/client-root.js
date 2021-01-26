const config = require('config');
const { connect } = require('ljit-db/mongoose');
const logger = require('../server/lib/logger');
const { server } = require('../server/client');

connect(config.SERVER.MONGO.URL)
	.then(() => {
		server.listen(config.SERVER.CLIENT.PORT, config.SERVER.CLIENT.HOST, () => {
			const { address, port } = server.address();
			const url = `http://${address}:${port}`;

			logger.info(`server listening at ${url} with ${config.MODE} mode`);
		});
	})
	.catch(error => {
		logger.error(error);
		throw error;
	});
