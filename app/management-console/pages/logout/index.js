import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import { authActions } from '../../controller';
import { RouteKeyEnums } from '../../routes';
import { LoadingStatusEnum } from '../../../lib/enums';
import { usePrevious } from '../../../lib/react-utils';

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
	const prevLogoutLoadingStatus = usePrevious(logoutLoadingStatus);

	useEffect(() => {
		logoutAction();
	}, []);

	useEffect(() => {
		if (prevLogoutLoadingStatus === LOADING && logoutLoadingStatus === SUCCESS) {
			onNavigate(LOGIN);
			location.reload();
		}
	}, [logoutLoadingStatus]);

	return null;
};

LogoutPage.propTypes = propTypes;

function mapStateToPros(state) {
	return {
		logoutLoadingStatus: state.auth.get('logoutLoadingStatus'),
	};
}

function mapDispatchToPros(dispatch) {
	return {
		logoutAction: () => dispatch(logoutAction()),
	};
}

export default connect(mapStateToPros, mapDispatchToPros)(LogoutPage);
