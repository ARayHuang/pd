import { combineEpics } from 'redux-observable';
import {
	checkAuthEpic,
	loginEpic,
	logoutEpic,
	updateChannelSettingsEpic,
} from './auth-epics';
import {
	initializeProviderApplicationEpic,
	initializeConsumerApplicationEpic,
} from './application-epics';
import {
	fetchProcessingOrdersEpic,
	fetchTrackedOrdersEpic,
	fetchClosedOrdersEpic,
	fetchOrderEpic,
	createOrderEpic,
	fetchNextProcessingOrdersEpic,
	deleteOrderEpic,
	completeOrderEpic,
	trackOrderEpic,
	acceptOrderEpic,
	resolveOrderEpic,
	inviteOrderEpic,
	acceptInvitationOrderEpic,
	updateOrderNumberEpic,
	updateHadReadOrderEpic,

	fetchTrackedOrdersNumberOfItemsEpic,
	fetchProcessingOrdersNumberOfItemsEpic,
} from './order-epics';
import {
	fetchConsumerProcessingOrdersEpic,
	fetchConsumerTrackedOrdersEpic,
	fetchConsumerClosedOrdersEpic,
	fetchConsumerNextProcessingOrdersEpic,

	fetchConsumerProcessingOrdersNumberOfItemsEpic,
	fetchConsumerTrackedOrdersNumberOfItemsEpic,
} from './consumer-order-epics';
import {
	fetchCreatedOrdersEpic,
	fetchNextCreatedOrdersEpic,
} from './created-orders-epics';
import {
	fetchTagsEpic,
} from './tag-epics';
import {
	fetchCommentsEpic,
	createCommentEpic,
} from './comment-epics';
import {
	uploadFileEpic,
} from './file-epics';
import {
	fetchOnlinUsersEpic,
} from './online-users-epics';

const epics = combineEpics(
	checkAuthEpic,
	loginEpic,
	logoutEpic,
	updateChannelSettingsEpic,

	initializeProviderApplicationEpic,
	initializeConsumerApplicationEpic,

	fetchOrderEpic,
	fetchProcessingOrdersEpic,
	fetchTrackedOrdersEpic,
	fetchClosedOrdersEpic,
	fetchNextProcessingOrdersEpic,
	fetchTrackedOrdersNumberOfItemsEpic,
	fetchProcessingOrdersNumberOfItemsEpic,

	fetchConsumerProcessingOrdersEpic,
	fetchConsumerTrackedOrdersEpic,
	fetchConsumerClosedOrdersEpic,
	fetchConsumerNextProcessingOrdersEpic,
	fetchConsumerProcessingOrdersNumberOfItemsEpic,
	fetchConsumerTrackedOrdersNumberOfItemsEpic,

	fetchCreatedOrdersEpic,
	fetchNextCreatedOrdersEpic,

	createOrderEpic,
	deleteOrderEpic,
	acceptOrderEpic,
	resolveOrderEpic,
	trackOrderEpic,
	completeOrderEpic,
	inviteOrderEpic,
	acceptInvitationOrderEpic,
	updateOrderNumberEpic,

	fetchTagsEpic,

	fetchCommentsEpic,
	createCommentEpic,

	uploadFileEpic,

	updateHadReadOrderEpic,

	fetchOnlinUsersEpic,
);

export default epics;
