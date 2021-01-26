import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, StoreProvider } from './repositories';
import { connect } from 'react-redux';
import { initController } from 'ljit-store-connecter';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumb } from 'ljit-react-components';
import App from './app';

const basename = '/management';
const store = createStore();

initController(store, connect);

ReactDOM.render(
	<StoreProvider store={store}>
		<BrowserRouter basename={basename}>
			<Breadcrumb.BreadcrumbProvider>
				<App/>
			</Breadcrumb.BreadcrumbProvider>
		</BrowserRouter>
	</StoreProvider>,
	document.getElementById('management-console-root'),
);
