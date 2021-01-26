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

const {
	epicMiddleware,
	notifyHandlerMiddleware,
} = reduxMiddlewares;

export function createStore(initState = {}) {
	let middlewares = {};

	if (config.MODE === 'production' || config.MODE === 'pre-production') {
		middlewares = applyMiddleware(epicMiddleware, notifyHandlerMiddleware);
	} else {
		middlewares = composeWithDevTools(applyMiddleware(loggerMiddleWare, epicMiddleware, notifyHandlerMiddleware));
	}

	const store = reduxCreateStore(reducer, initState, middlewares);

	epicMiddleware.run(epics);
	return store;
}

export const StoreProvider = Provider;
