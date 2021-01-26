const config = require('config');
const OrderCommentModel = require('../models/order-comment');
const fixtureOrderFiles = require('./data/testing-order-comment');

async function drop() {
	try {
		await OrderCommentModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await OrderCommentModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	const ALLOW_TESTING_DATA = ['local', 'test'];

	try {
		if (ALLOW_TESTING_DATA.includes(config.MODE)) {
			await OrderCommentModel.insertMany(fixtureOrderFiles).exec();
		}
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return OrderCommentModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	deleteMany,
	insertMany,
	syncIndexes,
};
