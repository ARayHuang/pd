const config = require('config');
const ChannelModel = require('../models/channel');
const ALLOW_TESTING_DATA = ['local', 'test'];
const fixtureChannels = ALLOW_TESTING_DATA.includes(config.MODE) ?
	require('./data/testing-channel') :
	require('./data/channel');

async function drop() {
	try {
		await ChannelModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await ChannelModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	try {
		await ChannelModel.insertMany(fixtureChannels).exec();
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return ChannelModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	insertMany,
	deleteMany,
	syncIndexes,
};
