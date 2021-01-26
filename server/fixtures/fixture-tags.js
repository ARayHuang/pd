const config = require('config');
const TagModel = require('../models/tag');
const ALLOW_TESTING_DATA = ['local', 'test'];
const fixtureTags = ALLOW_TESTING_DATA.includes(config.MODE) ?
	require('./data/testing-tag') :
	require('./data/tag');

async function drop() {
	try {
		await TagModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await TagModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	try {
		await TagModel.insertMany(fixtureTags).exec();
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return TagModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	insertMany,
	syncIndexes,
	deleteMany,
};
