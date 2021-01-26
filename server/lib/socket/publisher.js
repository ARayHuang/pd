const logger = require('../logger');
const {
	ENUM_PUBLISH_TYPE,
} = require('../../lib/enum');
const { getSocketIo } = require('./socket-io');

/**
 * Get online users from all nodes.
 * @param {ObjectId|string} channelId
 * @param {string} departmentType
 * @param {Array<ObjectId|string>} userIds
 * @returns {Promise<Array<{id, username, displayName, type, departmentType, shiftType, profilePictureId}>>}
 */
async function getOnlineUsers({ channelId, departmentType, userIds } = {}) {
	const publishData = {
		type: ENUM_PUBLISH_TYPE.REPORT_USERS,
		data: {
			channelId,
			departmentType,
			userIds,
		},
	};

	try {
		const users = {};
		const replies = await publishDataToNodes(publishData);

		replies.forEach(reply => {
			if (!reply) {
				return;
			}

			for (let index = 0; index < reply.users.length; index++) {
				const user = reply.users[index];

				users[user.id] = user;
			}
		});

		return Object.values(users);
	} catch (error) {
		throw error;
	}
}

/**
 * @param {{id: string, name: string}} channel
 * @returns {Promise<{hostname: string}>}
 */
function publishCreatedChannel(channel) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_CREATED_CHANNEL,
		data: channel,
	});
}

/**
 * @param {{id: string, name: string}} channel
 * @returns {Promise<{hostname: string}>}
 */
function publishUpdatedChannel(channel) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_CHANNEL,
		data: channel,
	});
}

/**
 * @param {ObjectId|string} channelId
 * @returns {Promise<{hostname: string}>}
 */
function publishDeletedChannel(channelId) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_DELETED_CHANNEL,
		data: { id: channelId },
	});
}

/**
 * @param {ObjectId|string} userId
 * @param {Array<{id: string, name: string}>} channels
 * @returns {Promise<{hostname: string}>}
 */
function publishUpdatedUserChannels({ userId, channels }) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_USER_CHANNELS,
		data: {
			userId,
			channels,
		},
	});
}

/**
 * @param {Array<{id, name, fontColor, backgroundColor, status}>} tags
 * @returns {Promise<{hostname: string}>}
 */
function publishUpdatedTags(tags) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_TAGS,
		data: tags,
	});
}

/**
 * @param {Order} order
 * @returns {Promise<{hostname: string}>}
 */
function publishCreatedOrder(order) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER,
		data: order,
	});
}

/**
 * @param {Order} order
 * @returns {Promise<{hostname: string}>}
 */
function publishUpdatedOrder(order) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_ORDER,
		data: order,
	});
}

/**
 * @param {{orderId, id, user, content, createdAt}} orderComment
 * @returns {Promise<{hostname: string}>}
 */
function publishCreatedOrderComment(orderComment) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER_COMMENT,
		data: orderComment,
	});
}

/**
 * @param {{orderId, id, filename, type, url, thumbnailUrl, createdAt}} orderFile
 * @returns {Promise<{hostname: string}>}
 */
function publishCreatedOrderFile(orderFile) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER_FILE,
		data: orderFile,
	});
}

/**
 * @param {Array<string|ObjectId>} userIds - Emit to these user ids.
 * @param {{Object}} order
 * @returns {Promise<{hostname: string}>}
 */
function publishNewActivityOrder({ userIds, order }) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_ORDER_HAS_NEW_ACTIVITY,
		data: {
			userIds,
			order,
		},
	});
}

/**
 * @param {{id, status, type, inviter, invitee, order}} invitation
 * @returns {Promise<{hostname: string}>}
 */
function publishCreatedInvitation(invitation) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_CREATED_INVITATION,
		data: invitation,
	});
}

/**
 * @param {{id, status, type, inviter, invitee, order}} invitation
 * @returns {Promise<{hostname: string}>}
 */
function publishUpdatedInvitation(invitation) {
	return publishDataToNodes({
		type: ENUM_PUBLISH_TYPE.PUB_UPDATED_INVITATION,
		data: invitation,
	});
}

/**
 * Publish data to all nodes.
 * @param {string} type
 * @param {Object} data
 * @returns {Promise<Array<Object>>}
 */
function publishDataToNodes({ type, data }) {
	return new Promise((resolve, reject) => {
		const io = getSocketIo();
		const publishData = {
			type,
			data,
		};

		io.of('/').adapter.customRequest(publishData, (error, replies) => {
			if (error) {
				logger.error(error, { type, data });
				return reject(error);
			}

			resolve(replies);
		});
	});
}

module.exports = {
	getOnlineUsers,
	publishCreatedChannel,
	publishUpdatedChannel,
	publishDeletedChannel,
	publishUpdatedUserChannels,
	publishUpdatedTags,
	publishCreatedOrder,
	publishUpdatedOrder,
	publishCreatedOrderComment,
	publishCreatedOrderFile,
	publishNewActivityOrder,
	publishCreatedInvitation,
	publishUpdatedInvitation,
};
