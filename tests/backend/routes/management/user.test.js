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
	ADMIN: {
		password: '123qwe',
		username: 'admin',
	},
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
};
const USER_ID = {
	NOT_FOUND: '5ec4ec469d87c4387d9350b0',
	INVALID: '5ec4ec469d87c4387d9350b',
	MANAGER: {
		PROVIDER: '5ec4ec469d87c4387d9350ba',
	},
	STAFF: {
		PROVIDER: '5ec4ec469d87c4387d9350bb',
	},
};
let ADMIN_COOKIE;
let PROVIDER_MANAGER_COOKIE;
let CONSUMER_MANAGER_COOKIE;

beforeAll(async () => {
	try {
		await connect(config.SERVER.MONGO.URL, { debug: false });
		await deleteDocuments();
		await insertDocuments();

		await request(app)
			.post('/api/v1/login')
			.send(LOGIN.ADMIN)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.then(res => {
				ADMIN_COOKIE = res.headers['set-cookie'];
			});
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
	} catch (error) {
		throw error;
	}
});

afterAll(() => {
	return mongoose.connection.close();
});

describe('user', () => {
	describe('get /api/v1/users', () => {
		test('200 ok', () => {
			return request(app)
				.get('/api/v1/users/?type=manager')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
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
		test('422 invalid type', () => {
			return request(app)
				.get('/api/v1/users/?type=invalid')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/users?via=admin', () => {
		test('201 created', () => {
			const body = {
				profilePictureId: '1',
				departmentType: 'provider',
				displayName: '新增主管帳號測試',
				password: '123qwe',
				username: 'createManagerTest',
				hasPermissionToAddStaff: true,
			};

			return request(app)
				.post('/api/v1/users?via=admin')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(201)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
					});
				});
		});
		test('403 forbidden', () => {
			const body = {
				profilePictureId: '1',
				departmentType: 'provider',
				displayName: '新增主管帳號測試',
				password: '123qwe',
				username: 'createManagerTest',
				hasPermissionToAddStaff: true,
			};

			return request(app)
				.post('/api/v1/users?via=admin')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('409 created', () => {
			const body = {
				profilePictureId: '1',
				departmentType: 'provider',
				displayName: '新增主管帳號測試',
				password: '123qwe',
				username: 'admin',
				hasPermissionToAddStaff: true,
			};

			return request(app)
				.post('/api/v1/users?via=admin')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(409)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid profilePictureId', () => {
			const body = {
				profilePictureId: '0',
				departmentType: 'provider',
				displayName: '新增主管帳號測試',
				password: '123qwe',
				username: 'createManagerTest',
				hasPermissionToAddStaff: true,
			};

			return request(app)
				.post('/api/v1/users?via=admin')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('post /api/v1/users?via=manager', () => {
		test('201 created', () => {
			const body = {
				profilePictureId: '1',
				shiftType: 'morning',
				channelIds: ['5ec5f60b25fbb049dbd231e2'],
				displayName: '新增部門人員帳號測試',
				password: '123qwe',
				username: 'createStaffTest',
			};

			return request(app)
				.post('/api/v1/users?via=manager')
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
				profilePictureId: '1',
				shiftType: 'morning',
				channelIds: ['5ec5f60b25fbb049dbd231e2'],
				displayName: '新增部門人員帳號測試',
				password: '123qwe',
				username: 'createStaffTest',
			};

			return request(app)
				.post('/api/v1/users?via=manager')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('409 created', () => {
			const body = {
				profilePictureId: '1',
				shiftType: 'morning',
				channelIds: ['5ec5f60b25fbb049dbd231e2'],
				displayName: '新增部門人員帳號測試',
				password: '123qwe',
				username: 'createStaffTest',
			};

			return request(app)
				.post('/api/v1/users?via=manager')
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(409)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid profilePictureId', () => {
			const body = {
				profilePictureId: '0',
				shiftType: 'morning',
				channelIds: ['5ec5f60b25fbb049dbd231e2'],
				displayName: '新增部門人員帳號測試',
				password: '123qwe',
				username: 'createStaffTest',
			};

			return request(app)
				.post('/api/v1/users?via=manager')
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

	describe('patch /api/v1/users/id=:userId?via=admin', () => {
		test('204 no content', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.MANAGER.PROVIDER}?via=admin`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.MANAGER.PROVIDER}?via=admin`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 manager not found', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.NOT_FOUND}?via=admin`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid profilePictureId', () => {
			const body = {
				profilePictureId: '',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.MANAGER.PROVIDER}?via=admin`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('patch /api/v1/users/id=:userId?via=manager', () => {
		test('204 no content', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.STAFF.PROVIDER}?via=manager`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('403 forbidden', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.STAFF.PROVIDER}?via=manager`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', CONSUMER_MANAGER_COOKIE)
				.expect(403)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 user not found', () => {
			const body = {
				profilePictureId: '1',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.NOT_FOUND}?via=manager`)
				.send(body)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', PROVIDER_MANAGER_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid profilePictureId', () => {
			const body = {
				profilePictureId: '',
			};

			return request(app)
				.patch(`/api/v1/users/id=${USER_ID.STAFF.PROVIDER}?via=manager`)
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

	describe('get /api/v1/users/id=:userId', () => {
		test('200 ok', () => {
			return request(app)
				.get(`/api/v1/users/id=${USER_ID.MANAGER.PROVIDER}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchSnapshot({
						id: expect.any(String),
					});
				});
		});
		test('404 user not found', () => {
			return request(app)
				.get(`/api/v1/users/id=${USER_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid userId', () => {
			return request(app)
				.get(`/api/v1/users/id=${USER_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});

	describe('delete /api/v1/users/id=:userId', () => {
		test('204 no content', () => {
			return request(app)
				.delete(`/api/v1/users/id=${USER_ID.MANAGER.PROVIDER}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(204)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('404 user not found', () => {
			return request(app)
				.delete(`/api/v1/users/id=${USER_ID.NOT_FOUND}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(404)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
		test('422 invalid userId', () => {
			return request(app)
				.delete(`/api/v1/users/id=${USER_ID.INVALID}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.set('Cookie', ADMIN_COOKIE)
				.expect(422)
				.then(res => {
					expect(res.body).toMatchSnapshot();
				});
		});
	});
});
