import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Icon,
	ListItem,
	Divider,
} from 'ljit-react-components';
import Tag from '../../../../components/tag';
import NewActivity from '../../../../components/new-activity';
import CopyableText from '../../../../components/copyable-text';
import OrderSteps from '../../../../components/order-steps';
import { formatDate } from '../../../../../lib/moment-utils';
import { checkIsOrderClosed } from '../../utils';
import cx from 'classnames';

const {
	USER_OUTLINE,
	CALENDAR,
	CHECK_CIRCEL,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const propTypes = {
	userId: PropTypes.string,
	scrollRefProps: PropTypes.object,
	selectedOrderId: PropTypes.string,
	onSelectedOrderId: PropTypes.func,
	item: PropTypes.object,
};

class Item extends Component {
	render() {
		const {
			userId,
			scrollRefProps,
			selectedOrderId,
			onSelectedOrderId,
			item,
		} = this.props;
		const {
			id,
			tags,
			createdAt,
			customerName,
			owner,
			handler,
			status,
			completedAt,
			channel: { name } = {},
			hasNewActivity,
			completedVia,
			resolvedVia,
			description, // 由於規格修改，订单号欄位為 "description"
		} = item;
		const stepData = {
			owner,
			handler,
			status,
			completedVia,
			resolvedVia,
		};
		const isOrderClosed = checkIsOrderClosed(status);
		const content = (
			<div className="list-item-wrap">
				<div className="channel-and-read-status">
					<NewActivity hasNewActivity={hasNewActivity && !isOrderClosed}/>
					<div className="channel-name" title={name}>{name}</div>
				</div>
				<Divider type="vertical" />
				<div className={cx('list-item-cell', 'list-item-cell--tag', { 'with-copyable-text': description })}>
					<Tag tag={tags[0]}/>
					<CopyableText prefix="No." text={description} isEllipsis/>
				</div>
				<div className="list-item-cell list-item-cell--status">
					<OrderSteps stepData={stepData} />
				</div>
				<div className="list-item-cell list-item-cell--description">
					<div><Icon type={USER_OUTLINE} size={X_SMALL}/><span title={customerName}>{customerName}</span></div>
					<div><Icon type={CALENDAR} size={X_SMALL}/>{formatDate(createdAt)}</div>
					{isOrderClosed && <div><Icon type={CHECK_CIRCEL} size={X_SMALL}/>{completedAt ? formatDate(completedAt) : '-'}</div>}
				</div>
			</div>
		);
		const isSelected = id === selectedOrderId;

		return (
			<div
				onClick={() => onSelectedOrderId(id)}
				ref={isSelected ? scrollRefProps : null}
			>
				<ListItem
					key={id}
					content={content}
					className={cx({ 'ljit-list-item--selected': isSelected }, { 'ljit-list-item--no-delete': owner.id !== userId })}
				/>
			</div>
		);
	}

	shouldComponentUpdate(prevProps) {
		const {
			item,
			selectedOrderId,
		} = this.props;
		const { id } = item;

		return JSON.stringify(item) !== JSON.stringify(prevProps.item) || id === selectedOrderId || id === prevProps.selectedOrderId;
	}
}

Item.propTypes = propTypes;

export default Item;
