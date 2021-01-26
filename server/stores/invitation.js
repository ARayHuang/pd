const {
	create,
	findOne,
	findOneAndUpdate,
} = require('../models/invitation');
const {
	ENUM_INVITATION_STATUS,
} = require('../lib/enum');
const MIN_PROJECTIONS = [
	'_id',
	'status',
	'type',
	'order',
	'inviter',
	'invitee',
];

function createInvitation({ type, order, inviter, invitee }) {
	return create({
		status: ENUM_INVITATION_STATUS.CREATED,
		type,
		order,
		inviter,
		invitee,
	})
		.exec({ lean: false });
}

function getInvitationByIdAndInvitee(id, invitee) {
	return findOne({
		_id: id,
		invitee,
		status: ENUM_INVITATION_STATUS.CREATED,
	})
		.exec({ lean: false });
}

function acceptInvitationByIdAndInvitee(id, invitee, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		invitee,
		status: ENUM_INVITATION_STATUS.CREATED,
	}, {
		$set: { status: ENUM_INVITATION_STATUS.ACCEPTED },
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

module.exports = {
	createInvitation,
	getInvitationByIdAndInvitee,
	acceptInvitationByIdAndInvitee,

	MIN_PROJECTIONS,
};
