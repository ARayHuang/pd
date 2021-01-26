const config = require('config');
const mongoose = require('mongoose');
const createModel = require('ljit-db/model');
const createInterface = require('ljit-db/model/interface');
const { schema, indexes } = require('../schemas/mongo/order-comment');
const mongooseSchema = new mongoose.Schema(schema, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

indexes.forEach(({ fields, options }) => {
	mongooseSchema.index(fields, options);
});

if (config.MODE === 'local') {
	mongooseSchema.plugin(require('mongoose-profiler')({
		isAlwaysShowQuery: false,
	}));
}

mongooseSchema.method('toJSON', function (options) {
	const result = this.$toObject(options, true);

	delete result._id;
	delete result.__v;
	result.id = this.id;

	return result;
});

const model = createModel(config.SERVER.DATABASE_TYPE, 'order_comments', mongooseSchema);

module.exports = createInterface(config.SERVER.DATABASE_TYPE, model);
