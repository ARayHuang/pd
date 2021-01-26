const config = require('config');
const mongoose = require('mongoose');
const createModel = require('ljit-db/model');
const createInterface = require('ljit-db/model/interface');
const { schema, indexes } = require('../schemas/mongo/user');
const mongooseSchema = new mongoose.Schema(schema, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});
const {
	verifyPassword,
} = require('../lib/cryptographic');

indexes.forEach(({ fields, options }) => {
	mongooseSchema.index(fields, options);
});

if (config.MODE === 'local') {
	mongooseSchema.plugin(require('mongoose-profiler')({
		isAlwaysShowQuery: false,
	}));
}

/**
 * @param {string} password - The user typed login password.
 * @returns {boolean}
 */
function isValidPassword(password) {
	return verifyPassword(password, this.key, this.password);
}

mongooseSchema.method('isValidPassword', isValidPassword);
mongooseSchema.method('toJSON', function (options) {
	const result = this.$toObject(options, true);

	delete result._id;
	delete result.__v;
	delete result.password;
	delete result.key;
	result.id = this.id;
	result.isOnline = this.isOnline;

	return result;
});

const model = createModel(config.SERVER.DATABASE_TYPE, 'users', mongooseSchema);

module.exports = createInterface(config.SERVER.DATABASE_TYPE, model);
