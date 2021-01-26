import {
	SET_SELECTED_ORDER_ID,
	RESET_SELECTED_ORDER_ID,
	START_LOGOUT,
	LOGIN_SUCCESS,
} from '../../../controller/actions/action-types';
import { v4 as uuidv4 } from 'uuid';

/* eslint-disable */
function createSocketMiddleware(socket) {
/* eslint-enable */
	let orderFileSubscribeId = '';

	return ({ getState }) => next => action => {
		// ADD socket emit here
		// if (action.type === 'XXX') {
		// 	socket.emit('yyyy', data);
		// }

		switch (action.type) {
			case SET_SELECTED_ORDER_ID: {
				const prevOrderFileSubscribeId = orderFileSubscribeId;
				const prevOrderFileSubscribeOrderId = getState().order.get('selectedOrderId');

				if (prevOrderFileSubscribeId) {
					socket.emit('ORDER.UNSUBSCRIBE', {
						id: prevOrderFileSubscribeId,
						orderId: prevOrderFileSubscribeOrderId,
					});
				}

				orderFileSubscribeId = `orderSubscribe_${uuidv4()}`;

				socket.emit('ORDER.SUBSCRIBE', {
					id: orderFileSubscribeId,
					orderId: action.id,
				});

				break;
			}

			case RESET_SELECTED_ORDER_ID: {
				const prevOrderFileSubscribeId = orderFileSubscribeId;
				const prevOrderFileSubscribeOrderId = getState().order.get('selectedOrderId');

				if (prevOrderFileSubscribeId) {
					socket.emit('ORDER.UNSUBSCRIBE', {
						id: prevOrderFileSubscribeId,
						orderId: prevOrderFileSubscribeOrderId,
					});

					orderFileSubscribeId = '';
				}

				break;
			}

			case LOGIN_SUCCESS: {
				socket.open();

				break;
			}

			case START_LOGOUT: {
				socket.close();

				break;
			}

			default:
				break;
		}

		return next(action);
	};
}

export default createSocketMiddleware;
