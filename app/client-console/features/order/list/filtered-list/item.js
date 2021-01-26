import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	Icon,
	Button,
	ListItem,
} from 'ljit-react-components';
import Tag from '../../../../components/tag';
import { Delete } from '../../../../images';
import NewActivity from '../../../../components/new-activity';
import CopyableText from '../../../../components/copyable-text';
import OrderSteps from '../../../../components/order-steps';
import { formatDate } from '../../../../../lib/moment-utils';
import { PREFIX_CLASS as PAGE_PREFIX_CLASS } from '../index';
import { checkIsOwnerOrCoOwner } from '../../utils';

const {
	USER_OUTLINE,
	CALENDAR,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const propTypes = {
	userId: PropTypes.string,
	selectedOrderId: PropTypes.string,
	onClickRemoveOrder: PropTypes.func,
	onSelectedOrderId: PropTypes.func,
	item: PropTypes.object,
};

class Item extends Component {
	constructor() {
		super();

		this._renderDeleteButton = this._renderDeleteButton.bind(this);
	}

	_renderDeleteButton(owner = {}, coOwner = {}) {
		const { id: ownerId } = owner;
		const { id: coOwnerId } = coOwner;
		const { userId, onClickRemoveOrder } = this.props;

		if (checkIsOwnerOrCoOwner(ownerId, coOwnerId, userId)) {
			return (
				<Button
					className={`${PAGE_PREFIX_CLASS}__btn-remove`}
					onClick={onClickRemoveOrder}
				>
					<img src={Delete}/>
				</Button>
			);
		}

		return <div />;
	}

	render() {
		const {
			userId,
			selectedOrderId,
			item,
			onSelectedOrderId,
		} = this.props;
		const {
			id,
			tags,
			createdAt,
			customerName,
			owner,
			handler,
			coOwner = {},
			status,
			hasNewActivity,
			completedVia,
			resolvedVia,
			description,
		} = item;
		const stepData = {
			owner,
			handler,
			status,
			completedVia,
			resolvedVia,
		};
		const content = (
			<div className="list-item-wrap">
				<div className={cx('list-item-cell', 'list-item-cell--tag', { 'with-copyable-text': description })}>
					<NewActivity hasNewActivity={hasNewActivity}/>
					<Tag tag={tags[0]}/>
					<CopyableText prefix="No." text={description} isEllipsis/>
				</div>
				<div className="list-item-cell list-item-cell--status">
					<OrderSteps stepData={stepData} />
				</div>
				<div className="list-item-cell list-item-cell--description">
					<div><Icon type={USER_OUTLINE} size={X_SMALL}/><span title={customerName}>{customerName}</span></div>
					<div><Icon type={CALENDAR} size={X_SMALL}/>{formatDate(createdAt)}</div>
				</div>
			</div>
		);
		const isSelected = id === selectedOrderId;
		const { id: ownerId } = owner;
		const { id: coOwnerId } = coOwner;
		const hasDelete = checkIsOwnerOrCoOwner(ownerId, coOwnerId, userId);

		return (
			<div onClick={() => onSelectedOrderId(id)}>
				<ListItem
					key={id}
					content={content}
					className={cx({ 'ljit-list-item--selected': isSelected }, { 'ljit-list-item--no-delete': !hasDelete })}
					right={this._renderDeleteButton(owner, coOwner)}
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
