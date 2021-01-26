import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	renderedRoutes: PropTypes.object,
};

class AccountPage extends Component {
	render() {
		const { renderedRoutes } = this.props;

		return (
			<div>
				{renderedRoutes}
			</div>
		);
	}
}

AccountPage.propTypes = propTypes;

export default AccountPage;
