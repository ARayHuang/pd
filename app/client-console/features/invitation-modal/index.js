import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import ConfirmModal from '../../components/confirm-modal';
import {
	orderActions,
	orderSocketActions,
} from '../../controller';
import { OrderStatusEnums, LoadingStatusEnum } from '../../lib/enums';

const {
	CO_OWNER,
	CO_HANDLER,
	TRANSFERRED_OWNER,
	TRANSFERRED_HANDLER,
} = OrderStatusEnums;
const { acceptInvitationOrderAction } = orderActions;
const { removeInvitationAction } = orderSocketActions;
const propTypes = {
	invitations: PropTypes.array.isRequired,
	acceptInvitationOrderAction: PropTypes.func.isRequired,
	removeInvitationAction: PropTypes.func.isRequired,
	acceptInvitationOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
};
const ConfirmModalTitleMap = {
	[TRANSFERRED_OWNER]: '转接派单',
	[TRANSFERRED_HANDLER]: '转接派单',
	[CO_OWNER]: '协作派单',
	[CO_HANDLER]: '协作派单',
};
const ConfirmModalContentMap = {
	[TRANSFERRED_OWNER]: '将派单转接给你，请确认是否接收？',
	[TRANSFERRED_HANDLER]: '将派单转接给你，请确认是否接收？',
	[CO_OWNER]: '邀请你进行协作，请确认是否参与？',
	[CO_HANDLER]: '邀请你进行协作，请确认是否参与？',
};

function InvitationModal({
	acceptInvitationOrderAction,
	removeInvitationAction,
	invitations,
	acceptInvitationOrderLoadingStatus,
}) {
	const hasInvitation = invitations.length > 0;
	const _handleAcceptInvitation = () => {
		const id = getInvitationId(invitations);

		if (hasInvitation) {
			acceptInvitationOrderAction(id);
		}
	};
	const _handleRejectInvitation = () => {
		const id = getInvitationId(invitations);

		if (hasInvitation) {
			removeInvitationAction(id);
		}
	};
	const [firstInvitation = {}] = invitations;
	const {
		type,
		inviter: { displayName: inviterDisplayName = '' } = {},
	} = firstInvitation;
	const title = type ? ConfirmModalTitleMap[type] : '请求已发送';
	const message = type ? `${inviterDisplayName} ${ConfirmModalContentMap[type]}` : '处理中，请稍候';
	const isAcceptInvitationLoading = acceptInvitationOrderLoadingStatus === LoadingStatusEnum.LOADING;

	return (
		<ConfirmModal
			title={title}
			isVisible={hasInvitation && !isAcceptInvitationLoading}
			message={message}
			onClickOk={_handleAcceptInvitation}
			onClickCancel={_handleRejectInvitation}
			isHideButtons={!hasInvitation}
		/>
	);
}

InvitationModal.propTypes = propTypes;

function getInvitationId(invitations = []) {
	const [firstInvitation = {}] = invitations;
	const { id } = firstInvitation;

	return id;
}

function mapStateToProps(state) {
	return {
		invitations: state.invitations.get('data').toArray(),
		acceptInvitationOrderLoadingStatus: state.order.get('acceptInvitationOrderLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		acceptInvitationOrderAction: invitationId => dispatch(acceptInvitationOrderAction(invitationId)),
		removeInvitationAction: invitationId => dispatch(removeInvitationAction(invitationId)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationModal);
