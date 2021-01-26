const config = require('config');
const mongoose = require('mongoose');
const createModel = require('ljit-db/model');
const createInterface = require('ljit-db/model/interface');
const {
	ENUM_ORDER_FILE_TYPE,
} = require('../lib/enum');
const { getExtensionNameByFilename } = require('../lib/common');
const { schema, indexes } = require('../schemas/mongo/order-file');
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

function getExtensionName() {
	return getExtensionNameByFilename(this.filename);
}

mongooseSchema.method('getExtensionName', getExtensionName);
mongooseSchema.method('toJSON', function (options) {
	const result = this.$toObject(options, true);
	const extensionName = this.getExtensionName();

	delete result._id;
	delete result.__v;
	delete result.orderId;
	delete result.user;
	delete result.updatedAt;
	result.id = this.id;

	switch (this.type) {
		case ENUM_ORDER_FILE_TYPE.IMAGE:
			result.url = `${config.SERVER.S3.URL_PREFIX}/${config.SERVER.S3.FOLDERS.FULL_IMAGE}/${this.id}.${extensionName}`;
			result.thumbnailUrl = `${config.SERVER.S3.URL_PREFIX}/${config.SERVER.S3.FOLDERS.THUMBNAIL_IMAGE}/${this.id}.${extensionName}`;
			break;
		case ENUM_ORDER_FILE_TYPE.VIDEO:
			result.url = `${config.SERVER.S3.URL_PREFIX}/${config.SERVER.S3.FOLDERS.VIDEO}/${this.id}.${extensionName}`;
			break;
		default:
			throw new Error(`${this.type} not match any file types`);
	}

	return result;
});

const model = createModel(config.SERVER.DATABASE_TYPE, 'order_files', mongooseSchema);

module.exports = createInterface(config.SERVER.DATABASE_TYPE, model);
