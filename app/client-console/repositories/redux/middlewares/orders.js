import {
	actionTypes,
	orderActions,
} from '../../../controller';
import { OrderTypeEnums } from '../../../lib/enums';

const {
	CREATE_ORDER_SUCCESS,
	TRACK_ORDER_SUCCESS,
	COMPLETE_ORDER_SUCCESS,
	DELETE_ORDER_SUCCESS,
	UPDATE_HAD_READ_ORDER_SUCCESS,
} = actionTypes;
const {
	PROCESSING,
	TRACKED,
} = OrderTypeEnums;
const {
	fetchProcessingOrdersAction,
	fetchTrackedOrdersAction,
} = orderActions;
const DEFAULT_PAGE = 1;
const AMOUNT_OF_PER_PAGE = 20;
const ordersMiddleware = ({ getState, dispatch }) => next => action => {
	const { type } = action;
	const { orders, channel } = getState();
	const channelId = channel.get('data').toObject().id;
	const page = orders.getIn(['data', 'page']);
	const numOfItems = orders.getIn(['data', 'numOfItems']);
	const processingSearchQueries = orders.get('processingSearchQueries').toObject();
	const trackedSearchQueries = orders.get('trackedSearchQueries').toObject();
	const selectedTab = orders.get('selectedTab');

	switch (type) {
		case CREATE_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchProcessingOrdersAction(channelId, DEFAULT_PAGE, processingSearchQueries));
			}

			break;

		case TRACK_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchProcessingOrdersAction(channelId, DEFAULT_PAGE, processingSearchQueries));
			}

			break;

		case COMPLETE_ORDER_SUCCESS:
		case DELETE_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchProcessingOrdersAction(channelId, DEFAULT_PAGE, processingSearchQueries));
			}

			if (selectedTab === TRACKED) {
				let nextPage = page;

				if (
					page > DEFAULT_PAGE &&
					numOfItems > AMOUNT_OF_PER_PAGE &&
					numOfItems % AMOUNT_OF_PER_PAGE === 1
				) {
					nextPage -= 1;
				}

				dispatch(fetchTrackedOrdersAction(channelId, nextPage, trackedSearchQueries));
			}

			break;

		case UPDATE_HAD_READ_ORDER_SUCCESS:
			if (selectedTab === PROCESSING) {
				dispatch(fetchProcessingOrdersAction(channelId, DEFAULT_PAGE, processingSearchQueries));
			} else if (selectedTab === TRACKED) {
				dispatch(fetchTrackedOrdersAction(channelId, page, trackedSearchQueries));
			}

			break;

		default:
			break;
	}

	return next(action);
};

export default ordersMiddleware;
