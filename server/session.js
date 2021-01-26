const config = require('config');
const redis = require('redis');
const session = require('express-session');
const connectRedis = require('connect-redis');

/**
 * Generate the session middleware.
 * @param {Object} options - https://github.com/expressjs/session#sessionoptions
 * @returns {function}
 */
module.exports = options => {
	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient(config.SERVER.REDIS_URL.SESSION);

	return session({
		...options,
		store: new RedisStore({
			client: redisClient,
			ttl: config.SERVER.SESSION_TTL_IN_SECOND,
		}),
	});
};
