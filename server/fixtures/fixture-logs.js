const config = require('config');
const LogModel = require('../models/log');
const fixtureLogs = require('./data/testing-log');

async function drop() {
	try {
		await LogModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await LogModel.deleteMany().exec();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	const ALLOW_TESTING_DATA = ['local', 'test'];

	try {
		if (ALLOW_TESTING_DATA.includes(config.MODE)) {
			await LogModel.insertMany(fixtureLogs).exec();
		}
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return LogModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	insertMany,
	deleteMany,
	syncIndexes,
};
