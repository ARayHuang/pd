import { combineReducers } from 'redux';
import auth from './singles/auth';
import users from './singles/users';
import channels from './singles/channels';
import tags from './singles/tags';
import orders from './singles/orders';
import orderComments from './singles/order-comments';
import orderLogs from './singles/order-logs';

const reducer = combineReducers({
	auth,
	users,
	channels,
	tags,
	orders,
	orderComments,
	orderLogs,
});

export default reducer;
