const {
	NotFoundError,
	ForbiddenError,
} = require('ljit-error');
const {
	ORDER_NOT_FOUND,
	ORDER_IS_FORBIDDEN,
	ORDER_FILE_NOT_FOUND,
	USER_IS_FORBIDDEN,
} = require('../lib/error/code');
const {
	ORDER_PROJECTIONS,

	getOrderByIdAndChannelId,
} = require('../services/order');
const {
	ORDER_FILE_PROJECTIONS,

	getOrderFileByIdAndOrderId,
} = require('../services/order-file');
const {
	createOrderOperationRecord,
} = require('../services/order-operation-record');
const {
	ENUM_USER_DEPARTMENT,
} = require('../lib/enum');

function isUserIdEqualOwnerId(req, res, next) {
	const { owner, coOwner } = res.locals.order;

	if (req.user.equals(owner) || req.user.equals(coOwner)) {
		return next();
	}

	next(new ForbiddenError(
		USER_IS_FORBIDDEN.MESSAGE,
		USER_IS_FORBIDDEN.CODE,
	));
}

function isUserIdEqualHandlerId(req, res, next) {
	const { handler, coHandler } = res.locals.order;

	if (req.user.equals(handler) || req.user.equals(coHandler)) {
		return next();
	}

	next(new ForbiddenError(
		USER_IS_FORBIDDEN.MESSAGE,
		USER_IS_FORBIDDEN.CODE,
	));
}

/**
 * @param {Array<string>|undefined} projections
 * @returns {function(req: Object, res: Object, next: function)}
 * 		append {OrderModel} at res.locals.order
 */
function prepareOrder(projections) {
	return async (req, res, next) => {
		const { orderId, channelId } = req.params;

		try {
			const order = await getOrderByIdAndChannelId(orderId, channelId, {
				projections,
			});

			if (order === null) {
				return next(new NotFoundError(ORDER_NOT_FOUND.MESSAGE, ORDER_NOT_FOUND.CODE));
			}

			res.locals.order = order;
		} catch (error) {
			return next(error);
		}

		next();
	};
}

function prepareOrderFile(projections = ORDER_FILE_PROJECTIONS.MIN) {
	return async (req, res, next) => {
		const { orderId, fileId } = req.params;

		try {
			const orderFile = await getOrderFileByIdAndOrderId(fileId, orderId, { projections });

			if (orderFile === null) {
				throw new NotFoundError(
					ORDER_FILE_NOT_FOUND.MESSAGE,
					ORDER_FILE_NOT_FOUND.CODE,
				);
			}

			res.locals.orderFile = orderFile;

			next();
		} catch (error) {
			next(error);
		}
	};
}

function hasPermissionToCreateOrderComment(req, res, next) {
	return hasPermissionToAccessOrder(req, res, next);
}

function hasPermissionToUploadOrderFile(req, res, next) {
	return hasPermissionToAccessOrder(req, res, next);
}

function hasPermissionToCreateReadRecord(req, res, next) {
	return hasPermissionToAccessOrder(req, res, next);
}

/**
 * Rules:
 * 	1. When the user is provider, make sure the user is the owner or the co-owner of the order.
 * 	2. When the user is consumer, make sure the user is the handler or the co-handler of the order.
 * @param {{user: UserModel}} req
 * @param {{locals: {order: OrderModel}}} res
 * @param {function} next
 * @returns {undefined}
 */
function hasPermissionToAccessOrder(req, res, next) {
	const {
		owner,
		coOwner,
		handler,
		coHandler,
	} = res.locals.order;
	const { departmentType } = req.user;

	if (
		departmentType === ENUM_USER_DEPARTMENT.PROVIDER &&
		(req.user.equals(owner) || req.user.equals(coOwner))
	) {
		return next();
	}

	if (
		departmentType === ENUM_USER_DEPARTMENT.CONSUMER &&
		(req.user.equals(handler) || req.user.equals(coHandler))
	) {
		return next();
	}

	next(new ForbiddenError(
		ORDER_IS_FORBIDDEN.MESSAGE,
		ORDER_IS_FORBIDDEN.CODE,
	));
}

function validateOrderStatus(validStatus) {
	return (req, res, next) => {
		const { order } = res.locals;

		if (!validStatus.includes(order.status)) {
			return next(new ForbiddenError(
				ORDER_IS_FORBIDDEN.MESSAGE,
				ORDER_IS_FORBIDDEN.CODE,
			));
		}

		next();
	};
}

/**
 * @param {string} type
 * @returns {function(req, res, next)}
 */
function createOrderOperationRecordMiddleware(type) {
	/**
	 * @param {{user: User}} req
	 * @param {{locals: {locals: {operationRecord: {orderId: ObjectId}}}}} res
	 * @param {function} next
	 * @returns {Promise<*>}
	 */
	return async (req, res, next) => {
		try {
			await createOrderOperationRecord({
				userId: req.user._id,
				orderId: res.locals.operationRecord.orderId,
				type,
			});
		} catch (error) {
			return next(error);
		}

		next();
	};
}

async function isOrderExisted(req, res, next) {
	const { channelId, orderId } = req.params;

	try {
		const order = await getOrderByIdAndChannelId(orderId, channelId, {
			projections: ORDER_PROJECTIONS.ID,
		});

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	isUserIdEqualOwnerId,
	isUserIdEqualHandlerId,
	prepareOrder,
	prepareOrderFile,
	validateOrderStatus,
	hasPermissionToCreateOrderComment,
	hasPermissionToUploadOrderFile,
	hasPermissionToCreateReadRecord,
	createOrderOperationRecord: createOrderOperationRecordMiddleware,
	isOrderExisted,
};
