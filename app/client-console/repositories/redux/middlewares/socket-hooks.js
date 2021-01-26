import {
	OrderTypeEnums,
	OrderStatusEnums,
	ClientDepartmentTypeEnums,
} from '../../../lib/enums';
import {
	actionTypes,
	orderActions,
	orderSocketActions,
	createdOrdersActions,
	consumerOrderActions,
} from '../../../controller';

const {
	ACCEPTED,
	TRACKED,
	COMPLETED,
	DELETED,
} = OrderStatusEnums;
const {
	PROCESSING,
	TRACKED: TAB_TRACKED,
	CLOSED,
} = OrderTypeEnums;
const {
	PROVIDER,
	CONSUMER,
} = ClientDepartmentTypeEnums;
const {
	ON_ORDER_CREATED,
	ON_ORDER_UPDATED,
} = actionTypes;
const {
	setProcessingNumOfItemsAction,
	fetchProcessingOrdersAction,
	fetchTrackedOrdersAction,
	fetchClosedOrdersAction,
	fetchProcessingOrdersNumberOfItemsAction,
	fetchTrackedOrdersNumberOfItemsAction,
} = orderActions;
const {
	socketInsertOneOfOrdersAction,
	socketAppendCreatedOrderAction,
} = orderSocketActions;
const {
	fetchCreatedOrdersAction,
	setCreatedOrdersNumOfItemsAction,
} = createdOrdersActions;
const {
	fetchConsumerProcessingOrdersAction,
	fetchConsumerTrackedOrdersAction,
	fetchConsumerClosedOrdersAction,
	fetchConsumerProcessingOrdersNumberOfItemsAction,
	fetchConsumerTrackedOrdersNumberOfItemsAction,
} = consumerOrderActions;
const DEFAULT_PAGE = 1;
const FetchOrderListActionMaps = {
	[PROCESSING]: {
		action: fetchProcessingOrdersAction,
		queries: 'processingSearchQueries',
	},
	[TAB_TRACKED]: {
		action: fetchTrackedOrdersAction,
		queries: 'trackedSearchQueries',
	},
	[CLOSED]: {
		action: fetchClosedOrdersAction,
		queries: 'closedSearchQueries',
	},
};
const ConsumerFetchOrderListActionMaps = {
	[PROCESSING]: {
		action: fetchConsumerProcessingOrdersAction,
		queries: 'processingSearchQueries',
	},
	[TAB_TRACKED]: {
		action: fetchConsumerTrackedOrdersAction,
		queries: 'trackedSearchQueries',
	},
	[CLOSED]: {
		action: fetchConsumerClosedOrdersAction,
		queries: 'closedSearchQueries',
	},
};
const socketHooksMiddleware = ({ getState, dispatch }) => next => action => {
	const { auth } = getState();
	const myRole = auth.getIn(['me', 'departmentType']);
	const isProvider = myRole === PROVIDER;
	const isConsumer = myRole === CONSUMER;

	switch (action.type) {
		case ON_ORDER_CREATED: {
			const { order: createdOrder } = action;
			const { orders, createdOrders } = getState();
			const selectedTab = orders.get('selectedTab');
			const processingNumOfItems = orders.get('processingNumOfItems');
			const createdOrdersNumOfItems = createdOrders.getIn(['data', 'numOfItems']);

			if (isProvider) {
				if (selectedTab === PROCESSING) {
					dispatch(socketInsertOneOfOrdersAction(createdOrder));
				}

				dispatch(setProcessingNumOfItemsAction(processingNumOfItems + 1));
			}

			if (isConsumer) {
				dispatch(socketAppendCreatedOrderAction(createdOrder));
				dispatch(setCreatedOrdersNumOfItemsAction(createdOrdersNumOfItems + 1));
			}

			break;
		}

		case ON_ORDER_UPDATED: {
			const { order: updatedOrder } = action;
			const { status } = updatedOrder;
			const { orders, consumerOrders, channel } = getState();
			const channelId = channel.getIn(['data', 'id']);
			const processingSearchQueries = orders.get('processingSearchQueries').toObject();
			const trackedSearchQueries = orders.get('trackedSearchQueries').toObject();
			const consumerProcessingSearchQueries = consumerOrders.get('processingSearchQueries').toObject();
			const consumerTrackedSearchQueries = consumerOrders.get('trackedSearchQueries').toObject();
			const consumerSelectedTab = consumerOrders.get('selectedTab') || PROCESSING;
			const selectedTab = orders.get('selectedTab') || PROCESSING;
			let queries = {};

			if (isProvider) {
				const actionSetting = FetchOrderListActionMaps[selectedTab];
				const action = actionSetting.action;

				queries = orders.get(actionSetting.queries).toObject();
				dispatch(action(channelId, DEFAULT_PAGE, queries));

				switch (status) {
					case TRACKED:
						dispatch(fetchProcessingOrdersNumberOfItemsAction(channelId, processingSearchQueries));
						dispatch(fetchTrackedOrdersNumberOfItemsAction(channelId, trackedSearchQueries));
						break;

					case COMPLETED:
					case DELETED:
						dispatch(fetchProcessingOrdersNumberOfItemsAction(channelId, processingSearchQueries));
						dispatch(fetchTrackedOrdersNumberOfItemsAction(channelId, trackedSearchQueries));
						break;

					default:
						break;
				}
			}

			if (isConsumer) {
				const actionSetting = ConsumerFetchOrderListActionMaps[consumerSelectedTab];
				const action = actionSetting.action;

				queries = consumerOrders.get(actionSetting.queries).toObject();
				dispatch(action(DEFAULT_PAGE, queries));

				switch (status) {
					case ACCEPTED:
						dispatch(fetchCreatedOrdersAction());
						break;

					case TRACKED:
						dispatch(fetchConsumerProcessingOrdersNumberOfItemsAction(consumerProcessingSearchQueries));
						dispatch(fetchConsumerTrackedOrdersNumberOfItemsAction(consumerTrackedSearchQueries));
						break;

					case COMPLETED:
					case DELETED:
						dispatch(fetchConsumerProcessingOrdersNumberOfItemsAction(consumerProcessingSearchQueries));
						dispatch(fetchConsumerTrackedOrdersNumberOfItemsAction(consumerTrackedSearchQueries));
						break;

					default:
						break;
				}
			}

			break;
		}

		default:
			break;
	}

	return next(action);
};

export default socketHooksMiddleware;
