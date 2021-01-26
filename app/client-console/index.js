import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, StoreProvider } from './repositories';
import { connect } from 'react-redux';
import { initController } from 'ljit-store-connecter';
import App from './app';

const basename = '/client';
const store = createStore();

initController(store, connect);

ReactDOM.render(
	<StoreProvider store={store}>
		<BrowserRouter basename={basename}>
			<App/>
		</BrowserRouter>
	</StoreProvider>,
	document.getElementById('client-console-root'),
);
