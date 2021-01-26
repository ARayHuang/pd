import { combineReducers } from 'redux';
import { actionTypes } from '../../../controller';
import auth from './singles/auth';
import application from './singles/application';
import channel from './singles/channel';
import orders from './singles/orders';
import consumerOrders from './singles/consumer-orders';
import createdOrders from './singles/created-orders';
import order from './singles/order';
import tag from './singles/tag';
import comment from './singles/comment';
import file from './singles/file';
import onlineUsers from './singles/online-users';
import invitations from './singles/invitations';

const { LOGOUT_SUCCESS } = actionTypes;
const reducer = combineReducers({
	auth,
	application,

	channel,
	orders,
	consumerOrders,
	createdOrders,
	order,
	tag,
	comment,
	file,
	onlineUsers,
	invitations,
});
const appReducer = (state, action) => {
	if (action.type === LOGOUT_SUCCESS) {
		state = undefined;
	}

	return reducer(state, action);
};

export default appReducer;
