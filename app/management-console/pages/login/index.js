import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { RouteKeyEnums } from '../../routes';
import {
	Form,
	FormItem,
	Input,
	Icon,
	Button,
} from 'ljit-react-components';
import {
	authActions,
} from '../../controller';
import {
	LoadingStatusEnum,
} from '../../../lib/enums';
import PageModal from '../../components/page-modal';
import { connect } from 'ljit-store-connecter';
import { usePrevious } from '../../../lib/react-utils';
import logo from './images/logo.svg';
import './style.styl';

const {
	USER_OUTLINE,
	LOCK_OUTLINE,
} = Icon.IconTypeEnums;
const {
	SMALL,
} = Icon.SizeEnums;
const {
	WHITE,
} = Icon.ColorEnums;
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
const { Message } = PageModal;
const PREFIX_CLASS = 'login-page';
const propTypes = {
	onNavigate: PropTypes.func,
	loginAction: PropTypes.func,
	loginLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]),
	loginLoadingStatusMessage: PropTypes.string,
};

function LoginPage({
	onNavigate,
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
				onNavigate(ROOT);
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
						label=""
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
							prefix={(
								<Icon
									type={USER_OUTLINE}
									size={SMALL}
									color={WHITE}
								/>
							)}
							placeholder="请输入帐号"
						/>
					</FormItem>
					<FormItem
						label=""
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
							prefix={(
								<Icon
									type={LOCK_OUTLINE}
									size={SMALL}
									color={WHITE}
								/>
							)}
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
					<i className={cx(`${PREFIX_CLASS}__logo-icon`, `${PREFIX_CLASS}__logo-icon--large`)}>
						<img src={logo} alt="logo-icon"/>
					</i>
				</div>
				{_renderForm()}
			</div>
			<Message
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
