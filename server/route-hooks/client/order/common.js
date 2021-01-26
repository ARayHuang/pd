const {
	validator,
	generateIdSchema,
} = require('../../../lib/validations');
const {
	RequestValidationError,
	NotFoundError,
} = require('ljit-error');
const {
	ORDER_INVALID_REQUEST,
	ORDER_NOT_FOUND,
	USER_NOT_FOUND,
} = require('../../../lib/error/code');
const refactorErrors = require('../../../lib/error/refactorErrors');
const {
	ORDER_PROJECTIONS,

	getOrderAndChannelById,
} = require('../../../services/order');
const { getActiveUserById } = require('../../../services/user');

function createInvitationValidateRequestPayload(type) {
	const checkParams = validator.compile({
		orderId: generateIdSchema(),
	});
	const checkBody = validator.compile({
		userId: generateIdSchema(),
	});

	return (req, res, next) => {
		if (req.query.type !== type) {
			return next('route');
		}

		const paramsResult = checkParams(req.params);

		if (paramsResult !== true) {
			return next(
				new RequestValidationError(
					ORDER_INVALID_REQUEST.CODE,
					refactorErrors(paramsResult),
				),
			);
		}

		const bodyResult = checkBody(req.body);

		if (bodyResult !== true) {
			return next(
				new RequestValidationError(
					ORDER_INVALID_REQUEST.CODE,
					refactorErrors(bodyResult),
				),
			);
		}

		next();
	};
}

function prepareOrderAndChannel(projections = ORDER_PROJECTIONS.ID) {
	return async (req, res, next) => {
		const { orderId } = req.params;

		try {
			const order = await getOrderAndChannelById(orderId, {
				projections,
			});

			if (order === null) {
				throw new NotFoundError(
					ORDER_NOT_FOUND.MESSAGE,
					ORDER_NOT_FOUND.CODE,
				);
			}

			res.locals.order = order;

			next();
		} catch (error) {
			next(error);
		}
	};
}

function validateInviteeDepartmentType(validDepartmentType) {
	return async (req, res, next) => {
		const { user } = res.locals;

		if (user.departmentType !== validDepartmentType) {
			return next(new NotFoundError(
				USER_NOT_FOUND.MESSAGE,
				USER_NOT_FOUND.CODE,
			));
		}

		next();
	};
}

function prepareUser(projections) {
	return async (req, res, next) => {
		const { userId } = req.body;

		try {
			const user = await getActiveUserById(userId, {
				projections,
			});

			if (user === null) {
				throw new NotFoundError(
					USER_NOT_FOUND.MESSAGE,
					USER_NOT_FOUND.CODE,
				);
			}

			res.locals.user = user;

			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = {
	createInvitationValidateRequestPayload,
	prepareOrderAndChannel,
	validateInviteeDepartmentType,
	prepareUser,
};
