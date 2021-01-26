const os = require('os');
const { pick } = require('lodash');
const {
	ENUM_USER_TYPE,
	ENUM_PUBLISH_TYPE,
	ENUM_SOCKET_EVENT,
} = require('../enum');
const {
	getTopicByOrderId,
} = require('./common');

function handleReportUsers(io, data) {
	const onlineUsers = {};

	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (
			data.channelId &&
			user.type === ENUM_USER_TYPE.STAFF &&
			!user.channels.find(channel => channel.id === data.channelId)
		) {
			continue;
		}

		if (data.departmentType && data.departmentType !== user.departmentType) {
			continue;
		}

		if (data.userIds && !data.userIds.includes(user.id)) {
			continue;
		}

		onlineUsers[user.id] = pick(user, [
			'id',
			'username',
			'displayName',
			'type',
			'departmentType',
			'shiftType',
			'profilePictureId',
		]);
	}

	return {
		users: Object.values(onlineUsers),
	};
}

function handleCreatedChannel(io, channel) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if ([ENUM_USER_TYPE.ADMIN, ENUM_USER_TYPE.MANAGER].includes(user.type)) {
			user.channels.push(channel);
			socket.emit(ENUM_SOCKET_EVENT.UPDATED_CHANNELS, user.channels);
		}
	}
}

function handleUpdatedChannel(io, channel) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;
		const index = user.channels.findIndex(x => x.id === channel.id);

		if (index >= 0) {
			user.channels.splice(index, 1, channel);
			socket.emit(ENUM_SOCKET_EVENT.UPDATED_CHANNELS, user.channels);
		}
	}
}

function handleDeletedChannel(io, channel) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;
		const index = user.channels.findIndex(x => x.id === channel.id);

		if (index >= 0) {
			user.channels.splice(index, 1);
			socket.emit(ENUM_SOCKET_EVENT.UPDATED_CHANNELS, user.channels);
		}
	}
}

function handleUpdatedUserChannels(io, { userId, channels }) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (user.id !== userId) {
			continue;
		}

		user.channels = channels;
		socket.emit(ENUM_SOCKET_EVENT.UPDATED_CHANNELS, user.channels);
	}
}

function handleUpdatedTags(io, tags) {
	for (const socket of Object.values(io.sockets.sockets)) {
		socket.emit(ENUM_SOCKET_EVENT.UPDATED_TAGS, tags);
	}
}

function handleCreatedOrder(io, order) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (
			order.channel.id &&
			user.type === ENUM_USER_TYPE.STAFF &&
			!user.channels.find(channel => channel.id === order.channel.id)
		) {
			continue;
		}

		socket.emit(ENUM_SOCKET_EVENT.CREATED_ORDER, order);
	}
}

function handleUpdatedOrder(io, order) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (
			user.type === ENUM_USER_TYPE.STAFF &&
			!user.channels.find(channel => channel.id === order.channel.id)
		) {
			continue;
		}

		socket.emit(ENUM_SOCKET_EVENT.UPDATED_ORDER, order);
	}
}

function handleCreatedOrderComment(io, orderComment) {
	const topic = getTopicByOrderId(orderComment.orderId);
	const handlers = io.getHandlersByTopic(topic);

	handlers.forEach(handler => {
		handler(ENUM_SOCKET_EVENT.CREATED_ORDER_COMMENT, orderComment);
	});
}

function handleCreatedOrderFile(io, orderFile) {
	const topic = getTopicByOrderId(orderFile.orderId);
	const handlers = io.getHandlersByTopic(topic);

	handlers.forEach(handler => {
		handler(ENUM_SOCKET_EVENT.CREATED_ORDER_FILE, orderFile);
	});
}

function handleUpdatedOrderHasNewActivity(io, order) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (order.userIds.includes(user.id)) {
			socket.emit(
				ENUM_SOCKET_EVENT.UPDATED_ORDER_HAS_NEW_ACTIVITY,
				order.order,
			);
		}
	}
}

function handleCreatedInvitation(io, invitation) {
	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (invitation.invitee.id === user.id) {
			socket.emit(
				ENUM_SOCKET_EVENT.CREATED_INVITATION,
				invitation,
			);
		}
	}
}

function handleUpdatedInvitation(io, invitation) {
	const emitUserIds = [
		invitation.inviter.id,
		invitation.invitee.id,
	];

	for (const socket of Object.values(io.sockets.sockets)) {
		const { user } = socket;

		if (emitUserIds.includes(user.id)) {
			socket.emit(
				ENUM_SOCKET_EVENT.UPDATED_INVITATION,
				invitation,
			);
		}
	}
}

function generateCustomHook(io) {
	const handlers = {
		[ENUM_PUBLISH_TYPE.REPORT_USERS]: handleReportUsers,
		[ENUM_PUBLISH_TYPE.PUB_CREATED_CHANNEL]: handleCreatedChannel,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_CHANNEL]: handleUpdatedChannel,
		[ENUM_PUBLISH_TYPE.PUB_DELETED_CHANNEL]: handleDeletedChannel,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_USER_CHANNELS]: handleUpdatedUserChannels,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_TAGS]: handleUpdatedTags,
		[ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER]: handleCreatedOrder,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_ORDER]: handleUpdatedOrder,
		[ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER_COMMENT]: handleCreatedOrderComment,
		[ENUM_PUBLISH_TYPE.PUB_CREATED_ORDER_FILE]: handleCreatedOrderFile,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_ORDER_HAS_NEW_ACTIVITY]: handleUpdatedOrderHasNewActivity,
		[ENUM_PUBLISH_TYPE.PUB_CREATED_INVITATION]: handleCreatedInvitation,
		[ENUM_PUBLISH_TYPE.PUB_UPDATED_INVITATION]: handleUpdatedInvitation,
	};

	return ({ type, data }, callback) => {
		const handler = handlers[type];
		const result = handler(io, data);

		callback({
			...result,
			hostname: os.hostname(),
		});
	};
}

module.exports = {
	generateCustomHook,
};
