const config = require('config');
const OrderModel = require('../models/order');
const fixtureOrders = require('./data/testing-order');

async function drop() {
	try {
		await OrderModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await OrderModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	const ALLOW_TESTING_DATA = ['local', 'test'];

	try {
		if (ALLOW_TESTING_DATA.includes(config.MODE)) {
			await OrderModel.insertMany(fixtureOrders).exec();
		}
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return OrderModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	insertMany,
	deleteMany,
	syncIndexes,
};
