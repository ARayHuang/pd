const { pick } = require('lodash');
const { ENUM_INVITATION_TYPE } = require('../../../lib/enum');
const {
	ORDER_PROJECTIONS,

	createCoOwnerByIdOwnerAndCoOwner,
	createCoHandlerByIdOwnerAndCoHandler,
	transferOwnerByIdPreviousOwnerAndOwner,
	transferHandlerByIdPreviousHandlerAndHandler,
} = require('../../../services/order');
const {
	INVITATION_PROJECTIONS,

	acceptInvitationByIdAndInvitee,
} = require('../../../services/invitation');
const {
	publisher: {
		publishUpdatedInvitation,
		publishUpdatedOrder,
	},
} = require('../../../lib/socket');
const { ForbiddenError } = require('ljit-error');
const { USER_IS_FORBIDDEN } = require('../../../lib/error/code');
const { ENUM_LOG_TYPE } = require('../../../lib/enum');

module.exports = async (req, res, next) => {
	const { type, inviter, order } = res.locals.invitation;
	const { channelIds } = res.locals;
	const { invitationId } = req.params;

	try {
		let transferResult = null;

		if (type === ENUM_INVITATION_TYPE.CO_OWNER) {
			transferResult = await createCoOwnerByIdOwnerAndCoOwner({
				id: order,
				owner: inviter,
				coOwner: req.user,
			}, {
				channelIds,
			}, {
				projections: ORDER_PROJECTIONS.ID,
			});

			res.locals.log.type = ENUM_LOG_TYPE.INVITED_USER_INTO_ORDER;
		} else if (type === ENUM_INVITATION_TYPE.CO_HANDLER) {
			transferResult = await createCoHandlerByIdOwnerAndCoHandler({
				id: order,
				handler: inviter,
				coHandler: req.user,
			}, {
				channelIds,
			}, {
				projections: ORDER_PROJECTIONS.ID,
			});

			res.locals.log.type = ENUM_LOG_TYPE.INVITED_USER_INTO_ORDER;
		} else if (type === ENUM_INVITATION_TYPE.TRANSFERRED_OWNER) {
			transferResult = await transferOwnerByIdPreviousOwnerAndOwner({
				id: order,
				previousOwner: inviter,
				owner: req.user,
			}, {
				channelIds,
			}, {
				projections: ORDER_PROJECTIONS.ID,
			});

			res.locals.log.type = ENUM_LOG_TYPE.TRANSFERRED_ORDER;
		} else if (type === ENUM_INVITATION_TYPE.TRANSFERRED_HANDLER) {
			transferResult = await transferHandlerByIdPreviousHandlerAndHandler({
				id: order,
				previousHandler: inviter,
				handler: req.user,
			}, {
				channelIds,
			}, {
				projections: ORDER_PROJECTIONS.ID,
			});

			res.locals.log.type = ENUM_LOG_TYPE.TRANSFERRED_ORDER;
		}

		if (transferResult === null) {
			throw new ForbiddenError(
				USER_IS_FORBIDDEN.MESSAGE,
				USER_IS_FORBIDDEN.CODE,
			);
		}

		const invitation = await acceptInvitationByIdAndInvitee(invitationId, req.user, {
			projections: INVITATION_PROJECTIONS.MIN,
		});

		if (invitation === null) {
			throw new ForbiddenError(
				USER_IS_FORBIDDEN.MESSAGE,
				USER_IS_FORBIDDEN.CODE,
			);
		}

		const result = invitation.toJSON();

		publishUpdatedInvitation(pick(result, [
			'id',
			'status',
			'type',
			'inviter.id',
			'inviter.displayName',
			'invitee.id',
			'invitee.displayName',
			'order',
		]));
		publishUpdatedOrder(result.order);
		res.status(201).end();
		res.locals.operationRecord = { orderId: order };

		next();
	} catch (error) {
		next(error);
	}
};
