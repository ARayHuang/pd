const http = require('http');
const path = require('path');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { compose } = require('compose-middleware');
const redisAdapter = require('socket.io-redis');
const ljitMorgan = require('ljit-morgan');
const ljitErrorMiddleware = require('ljit-error/middlewares');
const logger = require('./lib/logger');
const errorLoggerMiddleware = require('./middlewares/error-logger');
const setRequestId = require('./middlewares/set-request-id');
const clientRoute = require('./routes/client');
const apiV1Route = require('./routes/client-api/index.v1');
const socketRoute = require('./routes/client-socket');
const session = require('./session');
const passport = require('./passport');
const { pong } = require('ljit-db/middlewares/health');
const { isLoggedIn } = require('./route-hooks/common');
const {
	getActiveChannelsByIds,
	getActiveChannels,

	CHANNEL_PROJECTIONS,
} = require('./services/channel');
const {
	ENUM_USER_TYPE,
} = require('./lib/enum');
const {
	getSocketIoByServer,
	initializeSocketWithIo,
	subscriber,
} = require('./lib/socket');
const app = express();
const server = http.createServer(app);
const io = getSocketIoByServer(server);
const cookieMiddleware = cookieParser();
const sessionMiddleware = session({
	...config.SERVER.SESSION,
	name: `${config.SERVER.SESSION.name}.client`,
});
const passportInitializeMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

app.use(setRequestId);
app.use(cookieMiddleware);
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(passportInitializeMiddleware);
app.use(passportSessionMiddleware);

if (config.MODE !== 'test') {
	app.use(ljitMorgan());
}

app.use('/api/v1', apiV1Route);
app.get('/health', pong);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(clientRoute);

if (config.MODE !== 'test') {
	app.use(errorLoggerMiddleware);
}

app.use(ljitErrorMiddleware);

io.adapter(redisAdapter(config.SERVER.REDIS_URL.SOCKET_IO_ADAPTER));
io.use((socket, next) => {
	const middleware = compose([
		cookieMiddleware,
		sessionMiddleware,
		passportInitializeMiddleware,
		passportSessionMiddleware,
		isLoggedIn(),
	]);

	middleware(socket.handshake, {}, async error => {
		if (error) {
			try {
				socket.disconnect(true);
			} catch (error) {
				return next(error);
			}

			next(error);
		} else {
			try {
				const { user } = socket.handshake;
				const { channels } = user;

				if (user.type === ENUM_USER_TYPE.STAFF) {
					user.channels = await getActiveChannelsByIds(channels, {
						projections: CHANNEL_PROJECTIONS.NAME,
					});
				} else {
					user.channels = await getActiveChannels({
						projections: CHANNEL_PROJECTIONS.NAME,
					});
				}

				socket.user = user.toJSON();
				initializeSocketWithIo(socket, io);
			} catch (error) {
				return next(error);
			}

			next();
		}
	});
});
io.on('connection', socket => {
	logger.info({
		message: '[socket] connection',
		user: socket.user.username,
	});
	socket.registerEvents(socketRoute);
	socket.on('disconnecting', () => {
		socket.unsubscribeAllTopics();
	});
	socket.on('error', error => {
		logger.error(error, {
			user: socket.user && socket.user.username,
		});
	});
});
io.of('/').adapter.customHook = subscriber.generateCustomHook(io);

module.exports = { app, server };
