const { createOrderOperationRecord } = require('../../../../services/order-operation-record');

module.exports = async (req, res, next) => {
	try {
		await createOrderOperationRecord(res.locals.operationRecord);
	} catch (error) {
		return next(error);
	}

	next();
};
