const request = require('supertest');
const { connect } = require('ljit-db/mongoose');
const config = require('config');
const mongoose = require('mongoose');
const {
	deleteDocuments,
	insertDocuments,
} = require('../../../../server/fixtures/index');
const { app } = require('../../../../server/client');
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

describe('user', () => {
	describe('get /api/v1/users/id=me', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/users/id=me')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('401 unauthorized', () => {
			return request(app)
				.get('/api/v1/users/id=me')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect(401)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
