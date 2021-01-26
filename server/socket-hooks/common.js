const { NotFoundError } = require('ljit-error');
const {
	CHANNEL_NOT_FOUND,
	ORDER_NOT_FOUND,
} = require('../lib/error/code');
const {
	getActiveChannelById,

	CHANNEL_PROJECTIONS,
} = require('../services/channel');
const {
	ORDER_PROJECTIONS,

	getOrderById,
} = require('../services/order');
const {
	ENUM_USER_TYPE,
} = require('../lib/enum');

async function isChannelExisted(socket, data, next) {
	try {
		const { channelId } = data;
		const channel = await getActiveChannelById(channelId, {
			projections: CHANNEL_PROJECTIONS.ID,
		});

		if (channel === null) {
			throw new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);
		}
	} catch (error) {
		return next(error);
	}

	next();
}

/**
 * @param {{user: {type: string, channels: Array<{id: string}>}}} socket
 * @param {{channelId: (ObjectId|string)}} data
 * @param {function} next
 * @returns {undefined}
 */
function validateUserChannelIfTypeIsStaff(socket, data, next) {
	if (socket.user.type !== ENUM_USER_TYPE.STAFF) {
		return next();
	}

	const { channelId } = data;
	const { channels } = socket.user;
	const channelIds = channels.map(channel => channel.id);

	if (channelIds.includes(`${channelId}`)) {
		return next();
	}

	next(new NotFoundError(
		CHANNEL_NOT_FOUND.MESSAGE,
		CHANNEL_NOT_FOUND.CODE,
	));
}

function prepareOrder(projections = ORDER_PROJECTIONS.ID) {
	return async (socket, data, next) => {
		try {
			const { orderId } = data;
			const order = await getOrderById(orderId, {
				projections,
			});

			if (order === null) {
				throw new NotFoundError(
					ORDER_NOT_FOUND.MESSAGE,
					ORDER_NOT_FOUND.CODE,
				);
			}

			data.order = order;

			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = {
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
	prepareOrder,
};
