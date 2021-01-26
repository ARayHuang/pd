const http = require('http');
const path = require('path');
const Queue = require('bull');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const BullAdminPanel = require('bull-admin-panel');
const { compose } = require('compose-middleware');
const redisAdapter = require('socket.io-redis');
const ljitMorgan = require('ljit-morgan');
const ljitErrorMiddleware = require('ljit-error/middlewares');
const errorLoggerMiddleware = require('./middlewares/error-logger');
const setRequestId = require('./middlewares/set-request-id');
const managementRoute = require('./routes/management');
const apiV1Route = require('./routes/management-api/index.v1');
const session = require('./session');
const passport = require('./passport');
const { pong } = require('ljit-db/middlewares/health');
const {
	ENUM_TASK_NAME,
	ENUM_USER_TYPE,
} = require('./lib/enum');
const { getSocketIoByServer } = require('./lib/socket');
const {
	isLoggedIn,
	hasManagementPermission,
} = require('./route-hooks/common');
const app = express();
const server = http.createServer(app);
const io = getSocketIoByServer(server);
const cookieMiddleware = cookieParser();
const sessionMiddleware = session({
	...config.SERVER.SESSION,
	name: `${config.SERVER.SESSION.name}.management`,
});
const isLoginMiddleware = isLoggedIn();
const hasManagementPermissionMiddleware = hasManagementPermission(
	[ENUM_USER_TYPE.ADMIN],
);
const passportInitializeMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();
const bullAdminPanelMiddleware = new BullAdminPanel({
	basePath: '/bull',
	server,
	queues: Object.values(ENUM_TASK_NAME)
		.map(name => new Queue(name, config.SERVER.REDIS_URL.TASK_QUEUE)),
	/**
	 * Do authorization for WebSocket.
	 * https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
	 * @param {Object} info
	 * @param {function} callback
	 * @returns {undefined}
	 */
	verifyClient: (info, callback) => {
		const middleware = compose([
			cookieMiddleware,
			sessionMiddleware,
			passportInitializeMiddleware,
			passportSessionMiddleware,
			isLoginMiddleware,
			hasManagementPermissionMiddleware,
		]);

		middleware(info.req, {}, error => {
			if (error) {
				callback(false);
			} else {
				callback(true);
			}
		});
	},
});

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
app.use(
	'/bull',
	isLoginMiddleware,
	hasManagementPermissionMiddleware,
	bullAdminPanelMiddleware,
);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(managementRoute);

if (config.MODE !== 'test') {
	app.use(errorLoggerMiddleware);
}

app.use(ljitErrorMiddleware);

io.adapter(redisAdapter(config.SERVER.REDIS_URL.SOCKET_IO_ADAPTER));

module.exports = { app, server };
