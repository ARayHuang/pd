const request = require('supertest');
const { connect } = require('ljit-db/mongoose');
const config = require('config');
const mongoose = require('mongoose');
const {
	deleteDocuments,
	insertDocuments,
} = require('../../../../server/fixtures/index');
const { app } = require('../../../../server/client');
const path = require('path');
const LOGIN = {
	MANAGER: {
		PROVIDER: {
			password: '123qwe',
			username: 'provider01',
		},
		CONSUMER: {
			password: '123qwe',
			username: 'consumer01',
		},
	},
	STAFF: {
		PROVIDER: {
			password: '123qwe',
			username: 'provider02',
		},
	},
};
const CHANNEL_ID = {
	EXISTED: '5ec5f60b25fbb049dbd231e2',
	NOT_FOUND: '5ec5f60b25fbb049dbd231e1',
	INVALID: '5ec5f60b25fbb049dbd231e',
};
const ORDER_ID = {
	CREATED: '5ed7496b9ee92451f2e76231',
	ACCEPTED: '5ed7496b9ee92451f2e76232',
	RESOLVED: '5ed7496b9ee92451f2e76233',
	TRACKED: '5ed7496b9ee92451f2e76234',
	NOT_FOUND: '5ed7496b9ee92451f2e76230',
	INVALID: '5ed7496b9ee92451f2e7623',
};
let PROVIDER_MANAGER_COOKIE;
let CONSUMER_MANAGER_COOKIE;
let PROVIDER_STAFF_COOKIE;

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
			.post('/api/v1/login')
			.send(LOGIN.MANAGER.CONSUMER)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.then(res => {
				CONSUMER_MANAGER_COOKIE = res.headers['set-cookie'];
			});
		await request(app)
			.post('/api/v1/login')
			.send(LOGIN.STAFF.PROVIDER)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.then(res => {
				PROVIDER_STAFF_COOKIE = res.headers['set-cookie'];
			});
		await request(app)
			.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
			.send({ content: '測試內容' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Cookie', PROVIDER_MANAGER_COOKIE)
			.expect(201);
	} catch (error) {
		throw error;
	}
});

afterAll(async () => {
	try {
		await mongoose.connection.close();
	} catch (error) {
		throw error;
	}
});

describe('order', () => {
	describe('get /api/v1/orders', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/orders?status=created')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						data: [
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
							},
						],
					});
				});
		});
		test('422 invalid status', () => {
			return request(app)
				.get('/api/v1/orders')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('get /api/v1/orders/id=:orderId', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.CREATED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
						serialNumber: expect.any(String),
						createdAt: expect.any(String),
					});
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 ok', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('get /api/v1/channels/id=:channelId/orders', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders?status=completed&status=deleted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						data: [
							{
								id: expect.any(String),
								serialNumber: expect.any(String),
								createdAt: expect.any(String),
							},
							{
								id: expect.any(String),
								serialNumber: expect.any(String),
								createdAt: expect.any(String),
								completedAt: expect.any(String),
							},
						],
					});
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders?status=completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 status required', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders', () => {
		test('201 created', () => {
			const body = {
				description: 'R1111111111',
				tagId: '5ed7351e4f46070bd8e2dfe6',
				customerName: '測試員',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders`)
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
		test('403 forbidden', () => {
			const body = {
				description: 'R1111111111',
				tagId: '5ed7351e4f46070bd8e2dfe6',
				customerName: '測試員',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});

		test('404 channelId not found', () => {
			const body = {
				description: 'R1111111111',
				tagId: '5ed7351e4f46070bd8e2dfe6',
				customerName: '測試員',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 tagId not found', () => {
			const body = {
				description: 'R1111111111',
				tagId: '5ed7351e4f46070bd8e2dfe5',
				customerName: '測試員',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders`)
				.send(body)
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
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/accepted', () => {
		test('201 created', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.CREATED}/accepted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.CREATED}/accepted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/accepted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.CREATED}/accepted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.CREATED}/accepted`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/resolved', () => {
		test('201 created', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/resolved`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/resolved`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/resolved`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.ACCEPTED}/resolved`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.ACCEPTED}/resolved`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/tracked', () => {
		test('201 created', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.RESOLVED}/tracked`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.RESOLVED}/tracked`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/tracked`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.RESOLVED}/tracked`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.RESOLVED}/tracked`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/completed', () => {
		test('201 created', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.TRACKED}/completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.TRACKED}/completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.NOT_FOUND}/completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.NOT_FOUND}/completed`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('delete /api/v1/channels/id=:channelId/orders/id=:orderId', () => {
		test('204 no content', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.CREATED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.CREATED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.delete(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.CREATED}`)
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
				.delete(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.CREATED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/read', () => {
		test('201 created', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.CREATED}/read`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.CREATED}/read`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid orderId', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.INVALID}/read`)
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

describe('comment', () => {
	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/comments', () => {
		test('201 created', () => {
			const body = {
				content: '測試內容',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
						createdAt: expect.any(String),
					});
				});
		});
		test('403 forbidden', () => {
			const body = {
				content: '測試內容',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channelId not found', () => {
			const body = {
				content: '測試內容',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			const body = {
				content: '測試內容',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/comments`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid channelId', () => {
			const body = {
				content: '測試內容',
			};

			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.INVALID}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
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

	describe('get /api/v1/channels/id=:channelId/orders/id=:orderId/comments', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body[0]).toMatchSnapshot({
						id: expect.any(String),
						createdAt: expect.any(String),
					});
				});
		});
		test('404 channelId not found', () => {
			return request(app)
				.get(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.ACCEPTED}/comments`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});

describe('file', () => {
	describe('post /api/v1/channels/id=:channelId/orders/id=:orderId/files', () => {
		test('201 created', async () => {
			let fileId;

			try {
				await request(app)
					.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/files`)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Cookie', PROVIDER_MANAGER_COOKIE)
					.field('Content-Type', 'multipart/form-data')
					.attach('file', path.resolve(__dirname, './file/test.png'))
					.expect(201)
					.then(res => {
						fileId = res.body.id;

						expect(res.body).toMatchSnapshot({
							id: expect.any(String),
							createdAt: expect.any(String),
							thumbnailUrl: expect.any(String),
							url: expect.any(String),
						});
					});
				await request(app)
					.delete(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/files/id=${fileId}`)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Cookie', PROVIDER_MANAGER_COOKIE)
					.expect(204);
			} catch (error) {
				throw error;
			}
		}, 20000);
		test('403 forbidden', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/files`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_STAFF_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 channel not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.NOT_FOUND}/orders/id=${ORDER_ID.ACCEPTED}/files`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 order not found', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.NOT_FOUND}/files`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid file', () => {
			return request(app)
				.post(`/api/v1/channels/id=${CHANNEL_ID.EXISTED}/orders/id=${ORDER_ID.ACCEPTED}/files`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.field('Content-Type', 'multipart/form-data')
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
