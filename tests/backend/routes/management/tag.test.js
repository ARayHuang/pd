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
const TAG_ID = {
	EXISTED: '5ed7351e4f46070bd8e2dfe6',
	NOT_FOUND: '5ed7351e4f46070bd8e2dfe5',
	INVALID: '5ed7351e4f46070bd8e2dfe',
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

describe('tag', () => {
	describe('get /api/v1/tags/id=:tagId', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/tags/id=${TAG_ID.EXISTED}`)
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
		test('404 tag not found', () => {
			return request(app)
				.get(`/api/v1/tags/id=${TAG_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid tagId', () => {
			return request(app)
				.get(`/api/v1/tags/id=${TAG_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('get /api/v1/tags', () => {
		test('200 ok', async () => {
			let data;

			try {
				await request(app)
					.get('/api/v1/tags')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Cookie', PROVIDER_MANAGER_COOKIE)
					.expect(200)
					.then(res => {
						data = res.body.data;
						expect(res.body).toMatchSnapshot({
							data: expect.any(Array),
						});
					});

				data.forEach(item => {
					expect(item).toMatchSnapshot({
						id: expect.any(String),
					});
				});
			} catch (error) {
				throw error;
			}
		});
		test('422 invalid sort', () => {
			return request(app)
				.get('/api/v1/tags?sort=invalid')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/tags', () => {
		test('201 created', () => {
			const body = {
				backgroundColor: '00FF00',
				fontColor: '00FF00',
				status: 'active',
				name: '測試標籤',
			};

			return request(app)
				.post('/api/v1/tags')
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
				backgroundColor: '00FF00',
				fontColor: '00FF00',
				status: 'active',
				name: '标签一',
			};

			return request(app)
				.post('/api/v1/tags')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(409)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});

		test('422 invalid backgroundColor', () => {
			const body = {
				backgroundColor: '',
				fontColor: '00FF00',
				status: 'active',
				name: '測試標籤',
			};

			return request(app)
				.post('/api/v1/tags')
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

	describe('put /api/v1/tags/id=:tagId', () => {
		test('204 no content', () => {
			const body = {
				status: 'disabled',
			};

			return request(app)
				.put(`/api/v1/tags/id=${TAG_ID.EXISTED}`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 tag not found', () => {
			const body = {
				status: 'disabled',
			};

			return request(app)
				.put(`/api/v1/tags/id=${TAG_ID.NOT_FOUND}`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid tagId', () => {
			const body = {
				status: 'disabled',
			};

			return request(app)
				.put(`/api/v1/tags/id=${TAG_ID.INVALID}`)
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

	describe('delete /api/v1/tags/id=:tagId', () => {
		test('204 no content', () => {
			return request(app)
				.delete(`/api/v1/tags/id=${TAG_ID.EXISTED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 no content', () => {
			return request(app)
				.delete(`/api/v1/tags/id=${TAG_ID.EXISTED}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid tagId', () => {
			return request(app)
				.delete(`/api/v1/tags/id=${TAG_ID.INVALID}`)
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
