import React, { Component } from 'react';
import LayoutRoute from './layout-route';
import AuthRoute from './auth-route';
import 'antd/dist/antd.min.css';
import 'ljit-react-components/dest/index.css';
import './styling/layout/style.styl';

class App extends Component {
	render() {
		return (
			<div>
				<AuthRoute
					render={auth => (<LayoutRoute auth={auth} />)}
				/>
			</div>
		);
	}
}

export default App;
