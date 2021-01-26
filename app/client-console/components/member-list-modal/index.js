import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal, ListItem, RemindText } from 'ljit-react-components';
import { List } from 'antd';
import { SelectSvg, PersonSvg, BlueWarningSvg } from '../../images';
import { OrderStatusEnums } from '../../lib/enums';
import './style.styl';

const {
	CO_OWNER,
	CO_HANDLER,
	TRANSFERRED_OWNER,
	TRANSFERRED_HANDLER,
} = OrderStatusEnums;
const PREFIX_CLASS = 'member-list-modal';
const propTypes = {
	memberList: PropTypes.array,
	memberSelectorType: PropTypes.oneOf([CO_OWNER, CO_HANDLER, TRANSFERRED_OWNER, TRANSFERRED_HANDLER, '']),
	className: PropTypes.string,
	onClickOk: PropTypes.func,
	onClickCancel: PropTypes.func,
};
const defaultProps = {
	memberList: [],
	memberSelectorType: '',
	className: '',
	onClickOk: () => {},
	onClickCancel: () => {},
};

function MemberListModal({
	memberList,
	memberSelectorType,
	className,
	onClickOk,
	onClickCancel,
}) {
	const [selectedUserId, setSelectedUserId] = useState('');
	const isTransfer = memberSelectorType === TRANSFERRED_OWNER || memberSelectorType === TRANSFERRED_HANDLER;
	const title = isTransfer ? '选择转接人员' : '选择协作人员';
	const isVisible = Boolean(memberSelectorType);

	function _handleClickOk() {
		onClickOk(selectedUserId);
		setSelectedUserId('');
	}

	function _handleClickCancel() {
		onClickCancel();
		setSelectedUserId('');
	}

	function _renderListCheckedIcon(id) {
		if (id === selectedUserId) {
			return <img src={SelectSvg} />;
		}
	}

	function _renderItems(item = {}) {
		const { displayName, id } = item;

		return (
			<div onClick={() => setSelectedUserId(id)}>
				<ListItem
					key={id}
					content={
						<div className="list-item-wrap">
							{displayName}
						</div>
					}
					right={_renderListCheckedIcon(id)}
				/>
			</div>
		);
	}

	function _renderRemindText() {
		if (isTransfer) {
			return (
				<RemindText
					text={
						<div>
							<img src={BlueWarningSvg}/>
							<div>若转接给其他人员后，你将被删除此单</div>
						</div>
					}
				/>
			);
		}
	}

	return (
		<Modal
			title={<div><img src={PersonSvg}/>{title}</div>}
			modalSize={Modal.ModalSizeEnum.SMALL}
			className={cx(PREFIX_CLASS, className)}
			visible={isVisible}
			onClickOk={_handleClickOk}
			onClickCancel={_handleClickCancel}
			okButtonClassname={`${PREFIX_CLASS}__btn-ok`}
			cancelButtonClassname={`${PREFIX_CLASS}__btn-cancel`}
			isOkButtonDisabled={!selectedUserId}
		>
			<div>
				<div className="list-title">人员列表</div>
				<List
					itemLayout="horizontal"
					dataSource={memberList}
					locale={{ emptyText: '无其他人员上线' }}
					renderItem={item => _renderItems(item)}
				/>
				{_renderRemindText()}
			</div>
		</Modal>
	);
}

MemberListModal.propTypes = propTypes;
MemberListModal.defaultProps = defaultProps;

export default MemberListModal;
