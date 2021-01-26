import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import { authActions } from '../../controller';
import { RouteKeyEnums } from '../../routes';
import { LoadingStatusEnum } from '../../../lib/enums';

const {
	NONE,
	SUCCESS,
	FAILED,
	LOADING,
} = LoadingStatusEnum;
const { LOGIN } = RouteKeyEnums;
const { logoutAction } = authActions;
const propTypes = {
	onNavigate: PropTypes.func.isRequired,
	logoutAction: PropTypes.func.isRequired,
	logoutLoadingStatus: PropTypes.oneOf([NONE, SUCCESS, FAILED, LOADING]),
};
const LogoutPage = ({
	onNavigate,
	logoutAction,
	logoutLoadingStatus,
}) => {
	useEffect(() => {
		logoutAction();
	}, []);

	useEffect(() => {
		if (logoutLoadingStatus === SUCCESS) {
			onNavigate(LOGIN);
		} else if (logoutLoadingStatus === FAILED) {
			// TODO handle logout failed
			onNavigate(LOGIN);
		}
	}, [logoutLoadingStatus]);

	return null;
};

LogoutPage.propTypes = propTypes;

function mapStateToProps(state) {
	return {
		logoutLoadingStatus: state.auth.get('logoutLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logoutAction: () => dispatch(logoutAction()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
