const config = require('config');
const OrderFileModel = require('../models/order-file');
const fixtureOrderFiles = require('./data/testing-order-file');

async function drop() {
	try {
		await OrderFileModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await OrderFileModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	const ALLOW_TESTING_DATA = ['local', 'test'];

	try {
		if (ALLOW_TESTING_DATA.includes(config.MODE)) {
			await OrderFileModel.insertMany(fixtureOrderFiles).exec();
		}
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return OrderFileModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	insertMany,
	deleteMany,
	syncIndexes,
};
