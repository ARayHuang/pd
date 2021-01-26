import { combineEpics } from 'redux-observable';
import {
	fetchChannelsEpic,
	createChannelEpic,
	updateChannelEpic,
	deleteChannelEpic,
	fetchChannelOptionsEpic,
} from './channel-epics';
import {
	loginEpic,
	checkAuthEpic,
	logoutEpic,
} from './auth-epics';
import {
	fetchUsersEpic,
	createManagerEpic,
	createStaffEpic,
	updateManagerEpic,
	updateStaffEpic,
	deleteUserEpic,
} from './users-epics';
import {
	fetchTagsEpic,
	createTagEpic,
	updateTagEpic,
	deleteTagEpic,
} from './tag-epics';
import {
	fetchOrdersEpic,
} from './order-epics';
import {
	fetchOrderEpic,
	fetchOrderCommentsEpic,
} from './order-comment-epics';
import {
	fetchOrderLogsEpic,
} from './order-log-epics';

const epics = combineEpics(
	loginEpic,
	checkAuthEpic,
	fetchUsersEpic,
	createManagerEpic,
	createStaffEpic,
	updateManagerEpic,
	updateStaffEpic,
	deleteUserEpic,
	logoutEpic,

	fetchChannelsEpic,
	createChannelEpic,
	updateChannelEpic,
	deleteChannelEpic,
	fetchChannelOptionsEpic,

	fetchTagsEpic,
	createTagEpic,
	updateTagEpic,
	deleteTagEpic,

	fetchOrdersEpic,
	fetchOrderEpic,
	fetchOrderCommentsEpic,
	fetchOrderLogsEpic,
);

export default epics;
