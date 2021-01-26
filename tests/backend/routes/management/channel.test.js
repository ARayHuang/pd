const request = require('supertest');
const { connect } = require('ljit-db/mongoose');
const config = require('config');
const mongoose = require('mongoose');
const {
	deleteDocuments,
	insertDocuments,
} = require('../../../../server/fixtures/index');
const { app } = require('../../../../server/management');
const LOGIN = {
	MANAGER: {
		PROVIDER: {
			password: '123qwe',
			username: 'provider01',
		},
	},
};
const CHANNEL_ID = {
	EXISTED: '5ec5f60b25fbb049dbd231e2',
	NOT_FOUND: '5ec5f60b25fbb049dbd231e1',
	INVALID: '5ec5f60b25fbb049dbd231e',
};
let PROVIDER_MANAGER_COOKIE;

beforeAll(async () => {
	try {
		await connect(config.SERVER.MONGO.URL, { debug: false });
		await deleteDocuments();
		await insertDocuments();

		await request(app)
			.post('/api/v1/login')
			.send(LOGIN.MANAGER.PROVIDER)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.then(res => {
				PROVIDER_MANAGER_COOKIE = res.headers['set-cookie'];
			});
		await request(app)
			.post('/api/v1/channels')
			.send({ name: 'conflict' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Cookie', PROVIDER_MANAGER_COOKIE)
			.expect(201)
			.then();
	} catch (error) {
		throw error;
	}
});

afterAll(() => {
	return mongoose.connection.close();
});

describe('channel', () => {
	describe('get /api/v1/channels/id=:channelId', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
					});
				});
		});
		test('404 not found', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('get /api/v1/channels', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/channels')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						data: [
							{ id: expect.any(String) },
							{ id: expect.any(String) },
						],
					});
				});
		});
		test('422 invalid sort', () => {
			return request(app)
				.get('/api/v1/channels?sort=invalid')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels', () => {
		test('201 created', () => {
			const body = {
				name: 'createChannelTest',
			};

			return request(app)
				.post('/api/v1/channels')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
					});
				});
		});
		test('409 conflict', () => {
			const body = {
				name: 'createChannelTest',
			};

			return request(app)
				.post('/api/v1/channels')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(409)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid name', () => {
			const body = {
				name: '',
			};

			return request(app)
				.post('/api/v1/channels')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('put /api/v1/channels/id=:channelId', () => {
		test('204 no content', () => {
			const body = {
				name: 'updateChannelTest',
			};

			return request(app)
				.put(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channel not found', () => {
			const body = {
				name: 'updateChannelTest',
			};

			return request(app)
				.put(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('409 conflict', () => {
			const body = {
				name: 'conflict',
			};

			return request(app)
				.put(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(409)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.put(`/api/v1/channels/id=${CHANNEL_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('delete /api/v1/channels/id=:channelId', () => {
		test('204 no content', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channel not found', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
