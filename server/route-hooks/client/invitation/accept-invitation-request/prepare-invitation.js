const { getInvitationByIdAndInvitee } = require('../../../../services/invitation');
const { NotFoundError } = require('ljit-error');
const { ORDER_INVITATION_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { invitationId } = req.params;

	try {
		const invitation = await getInvitationByIdAndInvitee(invitationId, req.user);

		if (invitation === null) {
			throw new NotFoundError(
				ORDER_INVITATION_NOT_FOUND.MESSAGE,
				ORDER_INVITATION_NOT_FOUND.CODE,
			);
		}

		res.locals.invitation = invitation;

		next();
	} catch (error) {
		next(error);
	}
};
