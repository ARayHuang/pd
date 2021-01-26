const OrderOperationRecordModel = require('../models/order-operation-record');

async function drop() {
	try {
		await OrderOperationRecordModel.getInstance().collection.drop();
	} catch (error) {
		if (error.codeName === 'NamespaceNotFound') {
			return;
		}

		throw error;
	}
}

async function deleteMany() {
	try {
		await OrderOperationRecordModel.getInstance().collection.deleteMany();
	} catch (error) {
		throw error;
	}
}

function syncIndexes() {
	return OrderOperationRecordModel.getInstance().syncIndexes();
}

module.exports = {
	drop,
	deleteMany,
	syncIndexes,
};
