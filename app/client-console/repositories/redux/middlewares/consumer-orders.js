import {
	actionTypes,
	consumerOrderActions,
} from '../../../controller';
import { OrderTypeEnums } from '../../../lib/enums';

const {
	ACCEPT_ORDER_SUCCESS,
	RESOLVE_ORDER_SUCCESS,
	UPDATE_HAD_READ_ORDER_SUCCESS,
} = actionTypes;
const {
	PROCESSING,
	TRACKED,
} = OrderTypeEnums;
const {
	fetchConsumerProcessingOrdersAction,
	fetchConsumerTrackedOrdersAction,
} = consumerOrderActions;
const DEFAULT_PAGE = 1;
const consumerOrdersMiddleware = ({ getState, dispatch }) => next => action => {
	const { type } = action;
	const { consumerOrders } = getState();
	const processingSearchQueries = consumerOrders.get('processingSearchQueries').toObject();
	const trackedSearchQueries = consumerOrders.get('trackedSearchQueries').toObject();
	const selectedTab = consumerOrders.get('selectedTab');
	const page = consumerOrders.getIn(['data', 'page']);

	switch (type) {
		case ACCEPT_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				const { handlerId } = processingSearchQueries;

				dispatch(fetchConsumerProcessingOrdersAction(DEFAULT_PAGE, { handlerId }));
			}

			break;

		case RESOLVE_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchConsumerProcessingOrdersAction(DEFAULT_PAGE, processingSearchQueries));
			}

			break;

		case UPDATE_HAD_READ_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchConsumerProcessingOrdersAction(DEFAULT_PAGE, processingSearchQueries));
			} else if (selectedTab === TRACKED) {
				dispatch(fetchConsumerTrackedOrdersAction(page, trackedSearchQueries));
			}

			break;

		default:
			break;
	}

	return next(action);
};

export default consumerOrdersMiddleware;
