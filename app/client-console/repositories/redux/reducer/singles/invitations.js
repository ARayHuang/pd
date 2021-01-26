import { Map, List } from 'immutable';
import { actionTypes } from '../../../../controller';
import { OrderStatusEnums } from '../../../../../lib/enums';

const {
	APPEND_INVITATION,
	REMOVE_INVITATION,
	ADD_ACCEPTED_INVITATION_ORDER,
	REMOVE_ACCEPTED_INVITATION_ORDER,
} = actionTypes;
const { TRANSFERRED_HANDLER, TRANSFERRED_OWNER } = OrderStatusEnums;
const initialState = Map({
	data: List(),
	acceptedInvitation: List(),
});

export default function invitations(state = initialState, action) {
	switch (action.type) {
		case APPEND_INVITATION:
			return state.updateIn(
				['data'],
				invitations => {
					const matchedInvitation = invitations.find(invitation => {
						return (
							invitation.order.id === action.createdInvitation.order.id &&
							(
								invitation.type === action.createdInvitation.type ||
								invitation.type === TRANSFERRED_HANDLER ||
								invitation.type === TRANSFERRED_OWNER
							)
						);
					});

					if (matchedInvitation) {
						return List(invitations);
					}

					return List(invitations.push(action.createdInvitation));
				},
			);

		case REMOVE_INVITATION:
			return state.updateIn(
				['data'],
				invitations => List(invitations.filter(invitation => invitation.id !== action.invitationId)),
			);

		case ADD_ACCEPTED_INVITATION_ORDER: {
			const { orderId, invitationType } = action;

			return state.updateIn(['acceptedInvitation'], acceptedInvitation => acceptedInvitation.push({ orderId, invitationType }));
		}

		case REMOVE_ACCEPTED_INVITATION_ORDER: {
			const { orderId, invitationType } = action;

			return state.updateIn(['acceptedInvitation'], acceptedInvitation => acceptedInvitation.filter(invitation => !(invitation.orderId === orderId && invitation.invitationType === invitationType)));
		}

		default:
			return state;
	}
}
