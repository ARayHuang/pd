module.exports = {
	MODE: 'production',
	CLIENT: {
		SOCKET_URL: '/',
		BASE_API_URL: '/api/v1',
	},
	MANAGEMENT: {
		BASE_API_URL: '/api/v1',
	},
	SERVER: {
		MONGO: {
			URL: 'mongodb+srv://pd:le4y8ofDxfgkLLOk@pd.8sawa.mongodb.net/pd?retryWrites=true&w=majority',
		},
		REDIS_URL: {
			SESSION: 'redis://pd.v0og3f.ng.0001.apn2.cache.amazonaws.com:6379/0',
			TASK_QUEUE: 'redis://pd.v0og3f.ng.0001.apn2.cache.amazonaws.com:6379/1',
			SOCKET_IO_ADAPTER: 'redis://pd.v0og3f.ng.0001.apn2.cache.amazonaws.com:6379/2',
		},
		S3: {
			FOLDERS: {
				VIDEO: 'production/video',
				FULL_IMAGE: 'production/image/full',
				THUMBNAIL_IMAGE: 'production/image/thumbnail',
			},
		},
	},
};
