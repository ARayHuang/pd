import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'ljit-store-connecter';
import { Button } from 'ljit-react-components';
import { ClientDepartmentTypeEnums, OrderStatusEnums } from '../../../../lib/enums';
import { orderActions, onlineUsersAction } from '../../../../controller';
import DropdownButtons from '../../../../components/dropdown-buttons';
import MemberListModal from '../../../../components/member-list-modal';
import ConfirmModal from '../../../../components/confirm-modal';
import { MePropTypes } from '../../../../lib/prop-types-utils';
import { checkIsMatcher } from '../../utils';
import './styles.styl';

const {
	acceptOrderAction,
	resolveOrderAction,
	trackOrderAction,
	completeOrderAction,
	inviteOrderAction,
} = orderActions;
const {
	fetchOnlineUsersAction,
} = onlineUsersAction;
const {
	PROVIDER,
	CONSUMER,
	OWNER,
} = ClientDepartmentTypeEnums;
const {
	CREATED,
	ACCEPTED,
	RESOLVED,
	TRACKED,
	COMPLETED,
	DELETED,
	CO_OWNER,
	CO_HANDLER,
	TRANSFERRED_OWNER,
	TRANSFERRED_HANDLER,
} = OrderStatusEnums;
const ProviderButtonsMap = {
	[CREATED]: {
		hasHelpButtons: true,
		buttonsInfos: [
			{ title: '追踪', disabled: true, className: 'btn--grey', callbackName: '' },
			{ title: '结单', disabled: true, className: 'btn--blue', callbackName: '' },
		],
	},
	[ACCEPTED]: {
		hasHelpButtons: true,
		buttonsInfos: [
			{ title: '追踪', disabled: true, className: 'btn--grey', callbackName: '' },
			{ title: '结单', disabled: true, className: 'btn--blue', callbackName: '' },
		],
	},
	[RESOLVED]: {
		hasHelpButtons: true,
		buttonsInfos: [
			{ title: '追踪', disabled: false, className: 'btn--grey', callbackName: TRACKED },
			{ title: '结单', disabled: false, className: 'btn--blue', callbackName: COMPLETED },
		],
	},
	[TRACKED]: {
		hasHelpButtons: false,
		buttonsInfos: [{ title: '结单', disabled: false, className: 'btn--blue', callbackName: COMPLETED }],
	},
	[COMPLETED]: {
		hasHelpButtons: false,
		buttonsInfos: [],
	},
	[DELETED]: {
		hasHelpButtons: false,
		buttonsInfos: [],
	},
};
const ConsumerButtonsMap = {
	[CREATED]: {
		hasHelpButtons: false,
		buttonsInfos: [{ title: '接单', disabled: false, className: 'btn--blue', callbackName: ACCEPTED }],
	},
	[ACCEPTED]: {
		hasHelpButtons: true,
		buttonsInfos: [{ title: '完成', disabled: false, className: 'btn--blue', callbackName: RESOLVED }],
	},
	[RESOLVED]: {
		hasHelpButtons: false,
		buttonsInfos: [{ title: '已完成', disabled: true, className: 'btn--blue', callbackName: '' }],
	},
	[TRACKED]: {
		hasHelpButtons: false,
		buttonsInfos: [{ title: '已完成', disabled: true, className: 'btn--blue', callbackName: '' }],
	},
	[COMPLETED]: {
		hasHelpButtons: false,
		buttonsInfos: [],
	},
	[DELETED]: {
		hasHelpButtons: false,
		buttonsInfos: [],
	},
};
const ButtonsMap = {
	[PROVIDER]: ProviderButtonsMap,
	[OWNER]: ProviderButtonsMap,
	[CONSUMER]: ConsumerButtonsMap,
};
const propTypes = {
	departmentType: PropTypes.oneOf([PROVIDER, CONSUMER, OWNER]),
	orderData: PropTypes.object.isRequired,
	selectedChannel: PropTypes.object.isRequired,
	onlineUsers: PropTypes.array.isRequired,
	acceptOrderAction: PropTypes.func.isRequired,
	resolveOrderAction: PropTypes.func.isRequired,
	trackOrderAction: PropTypes.func.isRequired,
	completeOrderAction: PropTypes.func.isRequired,
	fetchOnlineUsersAction: PropTypes.func.isRequired,
	inviteOrderAction: PropTypes.func.isRequired,
	meData: MePropTypes.isRequired,
};
const PREFIX_CLASS = 'action-buttons';
const ConfirmModalSettingInitialState = {
	message: '',
	callbackName: '',
};

class ActionButtons extends Component {
	constructor() {
		super();

		this.state = {
			isShown: false,
			memberSelectorType: '',
			selectedMemberId: '',
			confirmModalSetting: ConfirmModalSettingInitialState,
		};

		this._handleShowConfirmModal = this._handleShowConfirmModal.bind(this);
		this._handleCloseConfirmModal = this._handleCloseConfirmModal.bind(this);
		this._handleClickOk = this._handleClickOk.bind(this);
		this._handleAcceptOrder = this._handleAcceptOrder.bind(this);
		this._handleResolveOrder = this._handleResolveOrder.bind(this);
		this._handleTrackOrder = this._handleTrackOrder.bind(this);
		this._handleCompleteOrder = this._handleCompleteOrder.bind(this);
		this._handleClickCoOwner = this._handleClickCoOwner.bind(this);
		this._handleClickTransfer = this._handleClickTransfer.bind(this);
		this._handleCoOwnerOrTransferOrder = this._handleCoOwnerOrTransferOrder.bind(this);
		this._handleClickSelectMemberModalCancel = this._handleClickSelectMemberModalCancel.bind(this);
		this._handleClickSelectMemberModalOk = this._handleClickSelectMemberModalOk.bind(this);

		this.callbackMaps = {
			[ACCEPTED]: this._handleAcceptOrder,
			[RESOLVED]: this._handleResolveOrder,
			[COMPLETED]: this._handleCompleteOrder,
			[TRACKED]: this._handleTrackOrder,
			[CO_OWNER]: this._handleCoOwnerOrTransferOrder,
			[CO_HANDLER]: this._handleCoOwnerOrTransferOrder,
			[TRANSFERRED_OWNER]: this._handleCoOwnerOrTransferOrder,
			[TRANSFERRED_HANDLER]: this._handleCoOwnerOrTransferOrder,
		};
	}

	_handleShowConfirmModal(confirmModalSetting) {
		this.setState({
			isShown: true,
			confirmModalSetting,
		});
	}

	_handleCloseConfirmModal() {
		this.setState({
			isShown: false,
		}, () => {
			this.setState({
				confirmModalSetting: ConfirmModalSettingInitialState,
			});
		});
	}

	_handleClickOk() {
		const { confirmModalSetting } = this.state;
		const callbackName = confirmModalSetting.callbackName;

		this.callbackMaps[callbackName]();
		this._handleCloseConfirmModal();
	}

	_handleAcceptOrder() {
		const { selectedChannel = {}, orderData, acceptOrderAction } = this.props;

		acceptOrderAction(selectedChannel.id, orderData.id);
	}

	_handleResolveOrder() {
		const { selectedChannel = {}, orderData, resolveOrderAction } = this.props;

		resolveOrderAction(selectedChannel.id, orderData.id);
	}

	_handleTrackOrder() {
		const { selectedChannel = {}, orderData, trackOrderAction } = this.props;

		trackOrderAction(selectedChannel.id, orderData.id);
	}

	_handleCompleteOrder() {
		const { selectedChannel = {}, orderData, completeOrderAction } = this.props;

		completeOrderAction(selectedChannel.id, orderData.id);
	}

	_handleCoOwnerOrTransferOrder(userId, invitationType) {
		const { orderData, inviteOrderAction } = this.props;
		const { id: orderId = '' } = orderData;

		inviteOrderAction(orderId, userId, invitationType);
	}

	_handleClickCoOwner() {
		const { selectedChannel, fetchOnlineUsersAction } = this.props;
		const memberSelectorType = this.props.departmentType === PROVIDER ? CO_OWNER : CO_HANDLER;

		fetchOnlineUsersAction(selectedChannel.id);
		this.setState({ memberSelectorType });
	}

	_handleClickTransfer() {
		const { selectedChannel, fetchOnlineUsersAction } = this.props;
		const memberSelectorType = this.props.departmentType === PROVIDER ? TRANSFERRED_OWNER : TRANSFERRED_HANDLER;

		fetchOnlineUsersAction(selectedChannel.id);
		this.setState({ memberSelectorType });
	}

	_handleClickSelectMemberModalCancel() {
		this.setState({ memberSelectorType: '' });
	}

	_handleClickSelectMemberModalOk(userId) {
		const { memberSelectorType } = this.state;

		this.callbackMaps[memberSelectorType](userId, memberSelectorType);
		this.setState({ memberSelectorType: '' });
	}

	render() {
		const {
			isShown,
			memberSelectorType,
			confirmModalSetting,
		} = this.state;
		const {
			departmentType = PROVIDER,
			orderData,
			onlineUsers,
			meData: { id: meId },
		} = this.props;
		const { message } = confirmModalSetting;
		const { status, coOwner, coHandler } = orderData;
		const { hasHelpButtons, buttonsInfos = [] } = ButtonsMap[departmentType][status] ? ButtonsMap[departmentType][status] : {};
		const {
			_handleShowConfirmModal,
			_handleCloseConfirmModal,
			_handleClickOk,
			_handleClickCoOwner,
			_handleClickTransfer,
			_handleClickSelectMemberModalCancel,
			_handleClickSelectMemberModalOk,
		} = this;
		const isMatcher = checkIsMatcher(departmentType, orderData, meId);
		const hasCoWorker = (
			departmentType === PROVIDER && Boolean(coOwner)
		) ||
		(
			departmentType === CONSUMER && Boolean(coHandler)
		);

		return (
			<>
				{hasHelpButtons && isMatcher &&
					<DropdownButtons
						onClickCoOwner={_handleClickCoOwner}
						onClickTransfer={_handleClickTransfer}
						isDisableCoWorkButton={hasCoWorker}
					/>}
				{buttonsInfos.map((buttonsInfo = {}, index) => {
					const { title, className, disabled, callbackName } = buttonsInfo;

					return (
						<Button
							key={`${title}-${index}`}
							onClick={() => _handleShowConfirmModal({
								message: `确定要${title}吗？`,
								callbackName: callbackName,
							})}
							disabled={disabled}
							className={cx(PREFIX_CLASS, className)}
						>
							{title}
						</Button>
					);
				})}
				{/* TODO 轉接/協作派單的 confirm modal 等加上 api 後考量資料流的狀況後再來實作 */}
				<ConfirmModal
					title="提示"
					isVisible={isShown}
					message={message}
					onClickOk={_handleClickOk}
					onClickCancel={_handleCloseConfirmModal}
				/>
				<MemberListModal
					memberList={onlineUsers}
					memberSelectorType={memberSelectorType}
					onClickCancel={_handleClickSelectMemberModalCancel}
					onClickOk={_handleClickSelectMemberModalOk}
				/>
			</>
		);
	}
}

ActionButtons.propTypes = propTypes;

function mapStateToProps(state) {
	return {
		meData: state.auth.get('me').toObject(),
		departmentType: state.auth.get('departmentType'),
		selectedChannel: state.channel.get('data').toObject(),
		orderData: state.order.get('data').toObject(),
		onlineUsers: state.onlineUsers.getIn(['data', 'onlineUsers']).toArray(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		acceptOrderAction: (...args) => dispatch(acceptOrderAction(...args)),
		resolveOrderAction: (...args) => dispatch(resolveOrderAction(...args)),
		trackOrderAction: (...args) => dispatch(trackOrderAction(...args)),
		completeOrderAction: (...args) => dispatch(completeOrderAction(...args)),
		fetchOnlineUsersAction: channelId => dispatch(fetchOnlineUsersAction(channelId)),
		inviteOrderAction: (...args) => dispatch(inviteOrderAction(...args)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
