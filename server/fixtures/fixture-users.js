const config = require('config');
const { generateKeyAndIv } = require('ljit-encryption');
const UserModel = require('../models/user');
const { hashPassword } = require('../lib/cryptographic');
const ALLOW_TESTING_DATA = ['local', 'test'];
const fixtureUsers = ALLOW_TESTING_DATA.includes(config.MODE) ?
	require('./data/testing-user') :
	require('./data/user');

async function drop() {
	try {
		await UserModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await UserModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

async function insertMany() {
	try {
		const hashUserPassword = user => {
			const key = generateKeyAndIv().key.toString('hex');

			return {
				...user,
				key,
				password: hashPassword(user.password, key),
			};
		};

		await UserModel.insertMany(fixtureUsers.map(hashUserPassword)).exec();
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return UserModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	deleteMany,
	insertMany,
	syncIndexes,
};
