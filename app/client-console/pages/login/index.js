import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RouteKeyEnums } from '../../routes';
import { withRouter } from 'react-router-dom';
import {
	Form,
	FormItem,
	Input,
	Button,
	Modal,
} from 'ljit-react-components';
import {
	authActions,
} from '../../controller';
import {
	LoadingStatusEnum,
} from '../../../lib/enums';
import { connect } from 'ljit-store-connecter';
import { usePrevious } from '../../../lib/react-utils';
import logo from './images/logo.svg';
import './style.styl';

const { ROOT } = RouteKeyEnums;
const {
	loginAction,
} = authActions;
const {
	NONE,
	LOADING,
	FAILED,
	SUCCESS,
} = LoadingStatusEnum;
const PREFIX_CLASS = 'login-page';
const propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func,
	}),
	loginAction: PropTypes.func,
	loginLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]),
	loginLoadingStatusMessage: PropTypes.string,
};

function LoginPage({
	history,
	loginAction,
	loginLoadingStatus,
	loginLoadingStatusMessage,
}) {
	const [isMessageVisible, setIsMessageVisible] = useState(false);
	const formInstance = useRef(null);
	const prevLoginLoadingStatus = usePrevious(loginLoadingStatus);

	useEffect(() => {
		if (LOADING === prevLoginLoadingStatus) {
			if (SUCCESS === loginLoadingStatus) {
				history.push({
					pathname: ROOT,
				});
			} else if (FAILED === loginLoadingStatus) {
				setIsMessageVisible(true);
			}
		}
	}, [loginLoadingStatus]);

	function _renderForm() {
		const className = `${PREFIX_CLASS}__form`;

		return (
			<div className={className}>
				<Form
					ref={formInstance}
					submitText="登录"
					cancelButtonDisabled
					onSubmit={_handleLogin}
				>
					<FormItem
						label="帐号"
						labelColon={false}
						itemName="username"
						itemConfig={{
							initialValue: '',
							rules: [
								{
									required: true,
									message: '帐号不能为空',
								},
							],
						}}
					>
						<Input
							className={`${className}__input`}
							placeholder="请输入帐号"
						/>
					</FormItem>
					<FormItem
						label="密码"
						labelColon={false}
						itemName="password"
						itemConfig={{
							initialValue: '',
							rules: [
								{
									required: true,
									message: '密码不能为空',
								},
							],
						}}
					>
						<Input
							className={`${className}__input`}
							placeholder="请输入密码"
							type="password"
						/>
					</FormItem>
				</Form>
			</div>
		);
	}

	function _handleLogin() {
		const form = formInstance.current.getForm();

		form.validateFields((error, values) => {
			if (error) {
				return;
			}

			const {
				username,
				password,
			} = values;

			loginAction(username, password);
			form.resetFields();
		});
	}

	function _handleCloseMessageModal() {
		setIsMessageVisible(false);
	}

	return (
		<div className={PREFIX_CLASS}>
			<div className={`${PREFIX_CLASS}__content`}>
				<div className={`${PREFIX_CLASS}__logo`}>
					<img src={logo} alt="派单系统"/>
				</div>
				<div className={`${PREFIX_CLASS}__title`}>派单系统</div>
				{_renderForm()}
			</div>
			<Modal.Message
				isFullMask
				title="通知"
				visible={isMessageVisible}
				message={loginLoadingStatusMessage}
				onClickCancel={_handleCloseMessageModal}
				footer={(
					<Button
						color={Button.ColorEnums.BRIGHTBLUE500}
						onClick={_handleCloseMessageModal}
					>
						确 定
					</Button>
				)}
			/>
		</div>
	);
}

function mapStateToProps(state) {
	const { auth } = state;

	return {
		loginLoadingStatus: auth.get('loginLoadingStatus'),
		loginLoadingStatusMessage: auth.get('loginLoadingStatusMessage'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginAction: (...args) => dispatch(loginAction(...args)),
	};
}

LoginPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage));
