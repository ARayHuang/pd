module.exports = {
	MODE: 'pre-production',
	CLIENT: {
		SOCKET_URL: '/',
		BASE_API_URL: '/api/v1',
	},
	MANAGEMENT: {
		BASE_API_URL: '/api/v1',
	},
	SERVER: {
		MONGO: {
			URL: 'mongodb+srv://twitch-admin:twitch-password@laas-dev-svcj4.mongodb.net/pd-alpha?retryWrites=true&w=majority',
		},
		REDIS_URL: {
			SESSION: 'redis://redis:6379/0',
			TASK_QUEUE: 'redis://redis:6379/1',
			SOCKET_IO_ADAPTER: 'redis://redis:6379/2',
		},
		S3: {
			FOLDERS: {
				VIDEO: 'alpha/video',
				FULL_IMAGE: 'alpha/image/full',
				THUMBNAIL_IMAGE: 'alpha/image/thumbnail',
			},
		},
	},
};
