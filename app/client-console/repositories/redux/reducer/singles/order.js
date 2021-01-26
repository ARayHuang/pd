import { Map } from 'immutable';
import { actionTypes } from '../../../../controller';
import { LoadingStatusEnum } from '../../../../lib/enums';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	START_FETCH_ORDER,
	FETCH_ORDER_SUCCESS,
	FETCH_ORDER_FAILED,
	SET_SELECTED_ORDER_ID,
	RESET_SELECTED_ORDER_ID,
	START_CREATE_ORDER,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAILED,
	START_DELETE_ORDER,
	DELETE_ORDER_SUCCESS,
	DELETE_ORDER_FAILED,
	START_COMPLETE_ORDER,
	COMPLETE_ORDER_SUCCESS,
	COMPLETE_ORDER_FAILED,
	START_TRACK_ORDER,
	TRACK_ORDER_SUCCESS,
	TRACK_ORDER_FAILED,
	START_ACCEPT_ORDER,
	ACCEPT_ORDER_SUCCESS,
	ACCEPT_ORDER_FAILED,
	START_RESOLVE_ORDER,
	RESOLVE_ORDER_SUCCESS,
	RESOLVE_ORDER_FAILED,
	APPEND_ORDER_FILE,
	START_UPDATE_HAD_READ_ORDER,
	UPDATE_HAD_READ_ORDER_SUCCESS,
	UPDATE_HAD_READ_ORDER_FAILED,
	START_INVITE_ORDER,
	INVITE_ORDER_SUCCESS,
	INVITE_ORDER_FAILED,
	START_ACCEPT_INVITATION_ORDER,
	ACCEPT_INVITATION_SUCCESS_ORDER,
	ACCEPT_INVITATION_FAILED_ORDER,
	START_UPDATE_ORDER_NUMBER,
	UPDATE_ORDER_NUMBER_SUCCESS,
	UPDATE_ORDER_NUMBER_FAILED,

	ON_ORDER_UPDATED,
} = actionTypes;
const initialState = Map({
	data: Map({}),
	selectedOrderId: '',

	fetchOrderLoadingStatus: NONE,
	fetchOrderLoadingStatusMessage: '',

	createOrderLoadingStatus: NONE,
	createOrderLoadingStatusMessage: '',

	deleteOrderLoadingStatus: NONE,
	deleteOrderLoadingStatusMessage: '',

	completeOrderLoadingStatus: NONE,
	completeOrderLoadingStatusMessage: '',

	trackOrderLoadingStatus: NONE,
	trackOrderLoadingStatusMessage: '',

	acceptOrderLoadingStatus: NONE,
	acceptOrderLoadingStatusMessage: '',

	resolveOrderLoadingStatus: NONE,
	resolveOrderLoadingStatusMessage: '',

	inviteOrderLoadingStatus: NONE,
	inviteOrderLoadingStatusMessage: '',

	acceptInvitationOrderLoadingStatus: NONE,
	acceptInvitationOrderLoadingStatusMessage: '',

	updateOrderNumberLoadingStatus: NONE,
	updateOrderNumberLoadingStatusMessage: '',

	readOrderLoadingStatus: NONE,
	readOrderLoadingStatusMessage: '',
});

export default function order(state = initialState, action) {
	switch (action.type) {
		case ON_ORDER_UPDATED: {
			const selectedOrderId = state.get('selectedOrderId');

			if (selectedOrderId === action.order.id) {
				return state.updateIn(['data'], order => Map({ ...action.order, files: order.get('files') }));
			}

			return state;
		}

		case START_FETCH_ORDER:
			return state.set('fetchOrderLoadingStatus', LOADING);

		case FETCH_ORDER_SUCCESS: {
			return state
				.set('data', Map(action.order))
				.set('fetchOrderLoadingStatus', SUCCESS);
		}

		case FETCH_ORDER_FAILED:
			return state
				.set('fetchOrderLoadingStatus', FAILED)
				.set('fetchOrderLoadingStatusMessage', action.errorMessage);

		case SET_SELECTED_ORDER_ID: {
			const { id = '' } = action;

			return state.set('selectedOrderId', id);
		}

		case RESET_SELECTED_ORDER_ID:
			return state
				.set('data', Map({}))
				.set('selectedOrderId', '');

		case START_CREATE_ORDER:
			return state
				.set('createOrderLoadingStatus', LOADING);

		case CREATE_ORDER_SUCCESS:
			return state
				.set('createOrderLoadingStatus', SUCCESS);

		case CREATE_ORDER_FAILED:
			return state
				.set('createOrderLoadingStatus', FAILED)
				.set('createOrderLoadingStatusMessage', action.errorMessage);

		case START_DELETE_ORDER:
			return state
				.set('deleteOrderLoadingStatus', LOADING);

		case DELETE_ORDER_SUCCESS:
			return state
				.set('deleteOrderLoadingStatus', SUCCESS);

		case DELETE_ORDER_FAILED:
			return state
				.set('deleteOrderLoadingStatus', FAILED)
				.set('deleteOrderLoadingStatusMessage', action.errorMessage);

		case START_COMPLETE_ORDER:
			return state
				.set('completeOrderLoadingStatus', LOADING);

		case COMPLETE_ORDER_SUCCESS:
			return state
				.set('completeOrderLoadingStatus', SUCCESS);

		case COMPLETE_ORDER_FAILED:
			return state
				.set('completeOrderLoadingStatus', FAILED)
				.set('completeOrderLoadingStatusMessage', action.errorMessage);

		case START_TRACK_ORDER:
			return state
				.set('trackOrderLoadingStatus', LOADING);

		case TRACK_ORDER_SUCCESS:
			return state
				.set('trackOrderLoadingStatus', SUCCESS);

		case TRACK_ORDER_FAILED:
			return state
				.set('trackOrderLoadingStatus', FAILED)
				.set('trackOrderLoadingStatusMessage', action.errorMessage);

		case START_ACCEPT_ORDER:
			return state
				.set('acceptOrderLoadingStatus', LOADING);
		case ACCEPT_ORDER_SUCCESS:
			return state
				.set('acceptOrderLoadingStatus', SUCCESS);
		case ACCEPT_ORDER_FAILED:
			return state
				.set('acceptOrderLoadingStatus', FAILED)
				.set('acceptOrderLoadingStatusMessage', action.errorMessage);

		case START_RESOLVE_ORDER:
			return state
				.set('resolveOrderLoadingStatus', LOADING);

		case RESOLVE_ORDER_SUCCESS:
			return state
				.set('resolveOrderLoadingStatus', SUCCESS);

		case RESOLVE_ORDER_FAILED:
			return state
				.set('resolveOrderLoadingStatus', FAILED)
				.set('resolveOrderLoadingStatusMessage', action.errorMessage);

		case APPEND_ORDER_FILE:
			return state.updateIn(['data', 'files'], files => [...files, action.orderFile]);

		case START_UPDATE_HAD_READ_ORDER:
			return state
				.set('readOrderLoadingStatus', LOADING);

		case UPDATE_HAD_READ_ORDER_SUCCESS:
			return state
				.set('readOrderLoadingStatus', SUCCESS);

		case UPDATE_HAD_READ_ORDER_FAILED:
			return state
				.set('readOrderLoadingStatus', FAILED)
				.set('readOrderLoadingStatusMessage', action.errorMessage);

		case START_INVITE_ORDER:
			return state
				.set('inviteOrderLoadingStatus', LOADING);

		case INVITE_ORDER_SUCCESS:
			return state
				.set('inviteOrderLoadingStatus', SUCCESS);

		case INVITE_ORDER_FAILED:
			return state
				.set('inviteOrderLoadingStatus', FAILED)
				.set('inviteOrderLoadingStatusMessage', action.errorMessage);

		case START_ACCEPT_INVITATION_ORDER:
			return state
				.set('acceptInvitationOrderLoadingStatus', LOADING);

		case ACCEPT_INVITATION_SUCCESS_ORDER:
			return state
				.set('acceptInvitationOrderLoadingStatus', SUCCESS);

		case ACCEPT_INVITATION_FAILED_ORDER:
			return state
				.set('acceptInvitationOrderLoadingStatus', FAILED)
				.set('acceptInvitationOrderLoadingStatusMessage', action.errorMessage);

		case START_UPDATE_ORDER_NUMBER:
			return state.set('updateOrderNumberLoadingStatus', LOADING);

		case UPDATE_ORDER_NUMBER_SUCCESS:
			return state.set('updateOrderNumberLoadingStatus', SUCCESS);

		case UPDATE_ORDER_NUMBER_FAILED:
			return state
				.set('updateOrderNumberLoadingStatus', FAILED)
				.set('updateOrderNumberLoadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
