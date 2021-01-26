const { pick } = require('lodash');
const { createInvitation } = require('../../../services/invitation');
const {
	publisher: { publishCreatedInvitation },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { order, user: invitee } = res.locals;

	try {
		const invitation = await createInvitation({
			type: req.query.type,
			order,
			inviter: req.user,
			invitee,
		});
		const result = invitation.toJSON();

		publishCreatedInvitation(pick(result, [
			'id',
			'status',
			'type',
			'inviter.id',
			'inviter.displayName',
			'invitee.id',
			'invitee.displayName',
			'order',
		]));
		res.status(201).send(pick(result, ['id']));
	} catch (error) {
		next(error);
	}
};
