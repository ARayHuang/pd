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
let ROVIDER_MANAGER_COOKIE;

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
				ROVIDER_MANAGER_COOKIE = res.headers['set-cookie'];
			});
	} catch (error) {
		throw error;
	}
});

afterAll(() => {
	return mongoose.connection.close();
});

describe('tag', () => {
	describe('get /api/v1/tags', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/tags')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ROVIDER_MANAGER_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
