const socketIo = require('socket.io');
const logger = require('../logger');
const {
	ENUM_SOCKET_EVENT,
} = require('../enum');
let io;

/**
 * Initialize socket.io by server.
 * @param {http.Server} server
 * @returns {socket.io}
 * 	{
 * 		... other properties
 * 	  topics: {
 * 	    "topic": {
 * 	      "socketId": function handler(event: string, data: Object)
 * 	    },
 * 	    ... other topics
 * 	  }
 * 	}
 */
function getSocketIoByServer(server) {
	io = socketIo(server);
	io.topics = {};
	io.getHandlersByTopic = getHandlersByTopic.bind(io);
	return io;
}

/**
 * Get the single IO instance.
 * @returns {socket.io}
 */
function getSocketIo() {
	if (!io) {
		throw new Error('not initial');
	}

	return io;
}

/**
 * Call this method when the socket is connecting.
 * @param {Socket} socket
 * @param {socket.io} io
 * @returns {undefined}
 */
function initializeSocketWithIo(socket, io) {
	socket.io = io;
	socket.subscribedTopics = new Set();
	socket.registerEvents = registerEvents.bind(socket);
	socket.subscribeTopic = subscribeTopic.bind(socket);
	socket.unsubscribeTopic = unsubscribeTopic.bind(socket);
	socket.unsubscribeAllTopics = unsubscribeAllTopics.bind(socket);
}

/**
 * Get all handlers by the topic.
 * @this socket.io
 * @param {string} topic
 * @returns {Array<function(event: string, data: Object)>}
 */
function getHandlersByTopic(topic) {
	const subscribedSockets = this.topics[topic] || {};

	return Object.values(subscribedSockets);
}

/**
 * @this Socket
 * @param {{event: function(socket, data, next)}} route
 * @returns {undefined}
 */
function registerEvents(route) {
	for (const [event, handler] of Object.entries(route)) {
		this.on(event, data => {
			logger.info({
				message: `[socket] ${event}`,
				data,
				user: this.user.username,
			});
			handler(this, data, error => {
				if (error) {
					logger.error(error, {
						user: this.user && this.user.username,
					});
					this.emit(ENUM_SOCKET_EVENT.RESPONSE, {
						event,
						id: data.id,
						status: error.getHttpCode(),
						error: error.toJson(),
					});
				}
			});
		});
	}
}

/**
 * @this Socket
 * @param {string} topic
 * @param {function(event: string, data: Object)} handler
 * @returns {undefined}
 */
function subscribeTopic(topic, handler) {
	this.io.topics[topic] = this.io.topics[topic] || {};
	this.io.topics[topic][this.id] = handler.bind(this);
	this.subscribedTopics.add(topic);
}

/**
 * @this Socket
 * @param {string} topic
 * @returns {undefined}
 */
function unsubscribeTopic(topic) {
	const subscribedSockets = this.io.topics[topic] || {};

	delete subscribedSockets[this.id];
	this.subscribedTopics.delete(topic);
}

/**
 * @this Socket
 * @returns {undefined}
 */
function unsubscribeAllTopics() {
	const allTopics = this.io.topics || {};

	this.subscribedTopics.forEach(topic => {
		delete allTopics[topic][this.id];
	});
	this.subscribedTopics.clear();
}

module.exports = {
	getSocketIoByServer,
	getSocketIo,
	initializeSocketWithIo,
};
