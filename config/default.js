const SESSION_TTL_IN_SECOND = 30 * 24 * 60 * 60;

module.exports = {
	MODE: 'local',
	WEBPACK: {
		PORT: 3003,
	},
	CLIENT: {
		SOCKET_URL: 'http://localhost:3000/',
		BASE_API_URL: 'http://localhost:3000/api/v1',
	},
	MANAGEMENT: {
		BASE_API_URL: 'http://localhost:3001/api/v1',
	},
	SERVER: {
		LOG_LEVEL: 'debug',
		CLIENT: {
			HOST: '0.0.0.0',
			PORT: 3000,
		},
		MANAGEMENT: {
			HOST: '0.0.0.0',
			PORT: 3001,
		},
		DATABASE_TYPE: 'mongo',
		MONGO: {
			URL: 'mongodb://localhost:27017/pai-dan',
		},
		REDIS_URL: {
			SESSION: 'redis://localhost:6379/0',
			TASK_QUEUE: 'redis://localhost:6379/1',
			SOCKET_IO_ADAPTER: 'redis://localhost:6379/2',
		},
		SESSION_TTL_IN_SECOND,
		SESSION: {
			// We extend from this object to express-session options.
			// https://github.com/expressjs/session#sessionoptions
			secret: 'tbrlk9capac',
			name: 'pai-dan',
			cookie: {
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: SESSION_TTL_IN_SECOND * 1000,
			},
			resave: false,
			saveUninitialized: false,
		},
		S3: {
			KEY: 'AKIAU73D6OQUYK5MSZP6',
			SECRET: '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',
			BUCKET: 'pd-storage',
			REGION: 'ap-northeast-1',
			URL_PREFIX: 'https://pd-storage.s3-ap-northeast-1.amazonaws.com',
			FOLDERS: {
				VIDEO: 'dev/video',
				FULL_IMAGE: 'dev/image/full',
				THUMBNAIL_IMAGE: 'dev/image/thumbnail',
			},
		},
		FILE_SIZE_LIMIT: 100 * 1024 * 1024,
		PAGINATION: {
			PAGE: 1,
			LIMIT: 20,
		},
		CHANNEL: {
			MAX: 50,
		},
		TAG: {
			MAX: 100,
		},
		ORDER_COMMENT: {
			MAX: 1000,
		},
		ORDER_FILE: {
			MAX: 100,
		},
		NANO_ID_ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	},
};
