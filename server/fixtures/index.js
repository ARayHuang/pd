const logger = require('../lib/logger');
const fixtureUsers = require('./fixture-users');
const fixtureChannels = require('./fixture-channels');
const fixtureInvitations = require('./fixture-invitations');
const fixtureLogs = require('./fixture-logs');
const fixtureTags = require('./fixture-tags');
const fixtureOrders = require('./fixture-orders');
const fixtureOrderComments = require('./fixture-order-comments');
const fixtureOrderFiles = require('./fixture-order-files');
const fixtureOrderOperationRecords = require('./fixture-order-operation-record');

/**
 * Drop collections then create indexes and default documents.
 * @returns {Promise<*>}
 */
async function initialCollections() {
	try {
		await dropCollections();
		await syncIndexes();
		await insertDocuments();
	} catch (error) {
		throw error;
	}
}

/**
 * Sync indexes.
 * @returns {Promise<*>}
 */
async function syncIndexes() {
	try {
		await fixtureUsers.syncIndexes();
		await fixtureChannels.syncIndexes();
		await fixtureInvitations.syncIndexes();
		await fixtureLogs.syncIndexes();
		await fixtureTags.syncIndexes();
		await fixtureOrders.syncIndexes();
		await fixtureOrderComments.syncIndexes();
		await fixtureOrderFiles.syncIndexes();
		await fixtureOrderOperationRecords.syncIndexes();

		logger.info('[mongo] sync indexes done');
	} catch (error) {
		logger.info('[mongo] sync indexes failed');
		throw error;
	}
}

/**
 * Delete documents.
 * @returns {Promise<*>}
 */
async function deleteDocuments() {
	try {
		await fixtureUsers.deleteMany();
		await fixtureChannels.deleteMany();
		await fixtureInvitations.deleteMany();
		await fixtureLogs.deleteMany();
		await fixtureTags.deleteMany();
		await fixtureOrders.deleteMany();
		await fixtureOrderComments.deleteMany();
		await fixtureOrderFiles.deleteMany();
		await fixtureOrderOperationRecords.deleteMany();

		logger.info('[mongo] delete documents done');
	} catch (error) {
		logger.info('[mongo] delete documents failed');
		throw error;
	}
}

/**
 * Insert documents.
 * @returns {Promise<*>}
 */
async function insertDocuments() {
	try {
		await fixtureUsers.insertMany();
		await fixtureChannels.insertMany();
		await fixtureLogs.insertMany();
		await fixtureTags.insertMany();
		await fixtureOrders.insertMany();
		await fixtureOrderFiles.insertMany();
		await fixtureOrderComments.insertMany();

		logger.info('[mongo] insert documents done');
	} catch (error) {
		logger.info('[mongo] insert documents failed');
		throw error;
	}
}

/**
 * Drop collections.
 * @returns {Promise<*>}
 */
async function dropCollections() {
	try {
		await fixtureUsers.drop();
		await fixtureChannels.drop();
		await fixtureInvitations.drop();
		await fixtureLogs.drop();
		await fixtureTags.drop();
		await fixtureOrders.drop();
		await fixtureOrderComments.drop();
		await fixtureOrderFiles.drop();
		await fixtureOrderOperationRecords.drop();

		logger.info('[mongo] drop collections done');
	} catch (error) {
		logger.info('[mongo] drop collections failed');
		throw error;
	}
}

module.exports = {
	initialCollections,
	syncIndexes,
	insertDocuments,
	deleteDocuments,
	dropCollections,
};
