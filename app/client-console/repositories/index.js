import {
	createStore as reduxCreateStore,
	applyMiddleware,
} from 'redux';
import loggerMiddleWare from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import config from '../config';
import {
	epics,
	reducer,
	middlewares as reduxMiddlewares,
} from './redux';
import {
	createSocketIO,
	createSocketListener,
} from '../socket';

const {
	epicMiddleware,
	notifyHandlerMiddleware,
	ordersMiddleware,
	consumerOrdersMiddleware,
	createSocketMiddleware,
	socketHooksMiddleware,
} = reduxMiddlewares;
const initialSocketIO = createSocketIO();
const socketMiddleware = createSocketMiddleware(initialSocketIO);

export function createStore(initState = {}) {
	let applyMiddlewares = [
		epicMiddleware,
		notifyHandlerMiddleware,
		ordersMiddleware,
		consumerOrdersMiddleware,
		socketMiddleware,
		socketHooksMiddleware,
	];
	let middlewares = {};

	if (config.MODE === 'production' || config.MODE === 'pre-production') {
		middlewares = applyMiddleware(...applyMiddlewares);
	} else {
		applyMiddlewares.push(loggerMiddleWare);
		middlewares = composeWithDevTools(applyMiddleware(...applyMiddlewares));
	}

	const store = reduxCreateStore(reducer, initState, middlewares);

	createSocketListener(initialSocketIO, store);

	epicMiddleware.run(epics);
	return store;
}

export const StoreProvider = Provider;
