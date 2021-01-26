const config = require('config');
const { ENUM_LOG_TYPE } = require('../lib/enum');
const mongoose = require('mongoose');
const createModel = require('ljit-db/model');
const createInterface = require('ljit-db/model/interface');
const { schema, indexes } = require('../schemas/mongo/log');
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

	if (this.type === ENUM_LOG_TYPE.UPDATED_ORDER_DESCRIPTION) {
		delete result.details;
		result.orderDescription = this.details.description;
	}

	return result;
});

const model = createModel(config.SERVER.DATABASE_TYPE, 'logs', mongooseSchema);

module.exports = createInterface(config.SERVER.DATABASE_TYPE, model);
