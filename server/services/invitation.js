const InvitationStore = require('../stores/invitation');
const OrderStore = require('../stores/order');

async function acceptInvitationByIdAndInvitee(id, invitee, {
	projections,
} = {}) {
	try {
		const invitation = await InvitationStore.acceptInvitationByIdAndInvitee(id, invitee, {
			projections,
		});

		if (invitation) {
			await invitation
				.populate({
					path: 'inviter',
					select: ['displayName'],
				})
				.populate({
					path: 'invitee',
					select: ['displayName'],
				})
				.execPopulate();

			if (invitation.order) {
				invitation.order = await OrderStore.getOrderAndChannelById(invitation.order);
			}
		}

		return invitation;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createInvitation: InvitationStore.createInvitation,
	getInvitationByIdAndInvitee: InvitationStore.getInvitationByIdAndInvitee,
	acceptInvitationByIdAndInvitee,

	INVITATION_PROJECTIONS: {
		MIN: InvitationStore.MIN_PROJECTIONS,
	},
};
