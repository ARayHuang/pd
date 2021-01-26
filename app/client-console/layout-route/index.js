import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import Provider from '../pages/provider';
import Consumer from '../pages/consumer';
import { ClientDepartmentTypeEnums } from '../lib/enums';
import { Layout } from 'ljit-react-components';
import { renderSwitches } from './render-routes';
import routes from '../routes';

const { Content } = Layout;
const {
	PROVIDER,
	CONSUMER,
} = ClientDepartmentTypeEnums;
const propTypes = {
	auth: PropTypes.shape({
		isAuthed: PropTypes.bool.isRequired,
	}).isRequired,
	departmentType: PropTypes.oneOf(Object.values(ClientDepartmentTypeEnums).concat('')),
};

class LayoutRoute extends Component {
	constructor() {
		super();

		this._renderPrivateLayout = this._renderPrivateLayout.bind(this);
		this._renderPublicLayout = this._renderPublicLayout.bind(this);
	}

	_renderPrivateLayout() {
		const { departmentType } = this.props;

		if (departmentType === PROVIDER) {
			return (
				<Provider/>
			);
		}

		if (departmentType === CONSUMER) {
			return (
				<Consumer/>
			);
		}
	}

	_renderPublicLayout() {
		return (
			<Content>
				{renderSwitches(routes)}
			</Content>
		);
	}

	render() {
		const { isAuthed } = this.props.auth;

		return (
			<div className="client-container">
				{isAuthed ? this._renderPrivateLayout() : this._renderPublicLayout()}
			</div>
		);
	}
}

LayoutRoute.propTypes = propTypes;

function mapStateToProps(state) {
	return {
		departmentType: state.auth.get('departmentType'),
	};
}

export default connect(mapStateToProps)(LayoutRoute);
