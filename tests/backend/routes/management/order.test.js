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
let PROVIDER_MANAGER_COOKIE;
const ORDER_ID = {
	CREATED: '5ed7496b9ee92451f2e76231',
	NOT_FOUND: '5ed7496b9ee92451f2e76230',
	INVALID: '5ed7496b9ee92451f2e7623',
};

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
	} catch (error) {
		throw error;
	}
});

afterAll(() => {
	return mongoose.connection.close();
});

describe('order', () => {
	describe('get /api/v1/orders', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/orders')
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
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
								completedAt: expect.any(String),
							},
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
							},
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
							},
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
							},
							{
								createdAt: expect.any(String),
								serialNumber: expect.any(String),
							},
						],
					});
				});
		});
		test('422 invalid page', () => {
			return request(app)
				.get('/api/v1/orders?description=test')
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
						createdAt: expect.any(String),
						serialNumber: expect.any(String),
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
		test('422 invalid orderId', () => {
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
});

describe('comment', () => {
	describe('get /api/v1/orders/id=:orderId/comments', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.CREATED}/comments`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						data: [
							{
								createdAt: expect.any(String),
							},
						],
					});
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.NOT_FOUND}/comments`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid orderId', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.INVALID}/comments`)
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

describe('log', () => {
	describe('get /api/v1/orders/id=:orderId/logs', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.CREATED}/logs`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 orderId not found', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.NOT_FOUND}/logs`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});

		test('422 invalid orderId', () => {
			return request(app)
				.get(`/api/v1/orders/id=${ORDER_ID.INVALID}/logs`)
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
