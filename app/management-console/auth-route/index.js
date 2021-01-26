import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Redirect,
	withRouter,
} from 'react-router-dom';
import { connect } from 'ljit-store-connecter';
import { Loading } from 'ljit-react-components';
import { RouteKeyEnums } from '../routes';
import { LoadingStatusEnum } from '../../lib/enums';
import { authActions } from '../controller';

const {
	checkAuthAction,
} = authActions;
const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	LOGIN,
	LOGOUT,
} = RouteKeyEnums;
const omitPaths = [
	LOGIN,
	LOGOUT,
];
const propTypes = {
	loadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	loginLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
	render: PropTypes.func.isRequired,
	checkAuthAction: PropTypes.func.isRequired,
};

export class AuthRoute extends Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		const {
			loadingStatus: nextLoadingStatus,
		} = nextProps;

		if (nextLoadingStatus !== prevState.lastLoadingStatus) {
			return {
				isAuthChecking: nextLoadingStatus === NONE || nextLoadingStatus === LOADING,
				isAuthed: nextLoadingStatus === SUCCESS,
				lastLoadingStatus: nextLoadingStatus,
			};
		}

		return null;
	}

	constructor(props) {
		super(props);
		this.state = {
			isAuthChecking: props.loadingStatus === NONE,
			isAuthed: false,
			lastLoadingStatus: NONE,
		};
	}

	render() {
		const {
			location,
			render,
		} = this.props;
		const {
			isAuthed,
			isAuthChecking,
		} = this.state;

		if (checkIsOmitPath(location.pathname)) {
			return render({ isAuthed: false });
		}

		if (isAuthChecking) {
			return <Loading />;
		}

		if (!isAuthed) {
			return (
				<Redirect
					to={{
						pathname: LOGIN,
						state: {
							from: location.pathname,
						},
					}}
				/>
			);
		}

		return render({ isAuthed });
	}

	componentDidMount() {
		const {
			location,
			checkAuthAction,
		} = this.props;

		if (!checkIsOmitPath(location.pathname)) {
			checkAuthAction();
		}
	}

	componentDidUpdate() {
		const {
			checkAuthAction,
			loginLoadingStatus,
		} = this.props;
		const {
			isAuthed,
		} = this.state;

		if (!isAuthed) {
			if (loginLoadingStatus === SUCCESS) {
				checkAuthAction();
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		const { loadingStatus } = this.props;

		return (nextProps.loadingStatus !== loadingStatus) ||
		(checkIsOmitPath(nextProps.location.pathname));
	}
}

function mapStateToProps(state) {
	return {
		loginLoadingStatus: state.auth.get('loginLoadingStatus'),
		loadingStatus: state.auth.get('loadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		checkAuthAction: () => dispatch(checkAuthAction()),
	};
}

AuthRoute.propTypes = propTypes;

function checkIsOmitPath(pathname = '') {
	const filteredOmitPaths = omitPaths
		.filter(omitPath => pathname.indexOf(omitPath) === 0);

	return filteredOmitPaths.length > 0;
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthRoute));
