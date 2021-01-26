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

describe('auth', () => {
	describe('post /api/v1/login', () => {
		test('201 created', () => {
			const body = {
				username: 'provider01',
				password: '123qwe',
			};

			return request(app)
				.post('/api/v1/login')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect(201)
				.expect('set-cookie', /^pai-dan\.management=.*; Path=\/; Expires=.*; HttpOnly$/)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('401 unauthorized (wrong password)', () => {
			const body = {
				username: 'provider01',
				password: '123qwer',
			};

			return request(app)
				.post('/api/v1/login')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect(401)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('401 unauthorized (wrong username)', () => {
			const body = {
				username: 'provider00',
				password: '123qwer',
			};

			return request(app)
				.post('/api/v1/login')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect(401)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid username', () => {
			const body = {
				username: 0,
				password: '123qwe',
			};

			return request(app)
				.post('/api/v1/login')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('/api/v1/logout', () => {
		test('201 created', () => {
			return request(app)
				.post('/api/v1/logout')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
