import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	ListItem,
	Icon,
	IconButton,
	Modal,
} from 'ljit-react-components';
import SearchForm from '../../../components/search-form';
import Tag from '../../../components/tag';
import Steps from '../../../components/steps';
import List from '../../../components/list';
import { formatDate } from '../../../../lib/moment-utils';
import { PREFIX_CLASS as PAGE_PREFIX_CLASS } from './index';
import './styles.styl';

const {
	USER_OUTLINE,
	CALENDAR,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const { CLOSE_CIRCLE_FILL } = IconButton.IconTypeEnums;
const propTypes = {
	ordersData: PropTypes.array,
	hasPagination: PropTypes.bool,
	onRemoveOder: PropTypes.func,
};
const defaultProps = {
	ordersData: generateFakeData(),
	hasPagination: false,
	onRemoveOder: () => {},
};
const PREFIX_CLASS = 'tracked-orders';

class OrderList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orders: props.ordersData,
			selectedOrder: {},
			isMessageModalVisible: false,
		};

		this._handleRemoveOrder = this._handleRemoveOrder.bind(this);
		this._handleCloseMessageModal = this._handleCloseMessageModal.bind(this);
		this._renderItems = this._renderItems.bind(this);
	}

	_handleRemoveOrder() {
		const {
			selectedOrder,
			orders,
		} = this.state;
		const newOrders = orders.filter(item => item.id !== selectedOrder.id);

		this.setState({
			orders: newOrders,
		});

		this._handleCloseMessageModal();
		this.props.onRemoveOder();
	}

	_handleCloseMessageModal() {
		this.setState({
			isMessageModalVisible: false,
		});
	}

	_renderItems(item) {
		const { selectedOrder } = this.state;
		const {
			id,
			tags,
			createdAt,
			customerName,
			owner,
			handler,
			status,
		} = item;
		const stepData = {
			owner,
			handler,
			status,
		};
		const content = (
			<div className="list-item-wrap">
				<div className="list-item-cell list-item-cell--tag">
					<Tag tag={tags[0]}/>
				</div>
				<div className="list-item-cell list-item-cell--status">
					<Steps stepData={stepData} />
				</div>
				<div className="list-item-cell list-item-cell--description">
					<div><Icon type={USER_OUTLINE} size={X_SMALL}/>{customerName}</div>
					<div><Icon type={CALENDAR} size={X_SMALL}/>{formatDate(createdAt)}</div>
				</div>
			</div>
		);
		const isSelected = id === selectedOrder.id;

		return (
			<div onClick={() => this.setState({ selectedOrder: item })}>
				<ListItem
					key={id}
					content={content}
					className={isSelected ? 'ljit-list-item--selected' : null}
					// Todo: 判斷 owner 是不是自己，是的話才可以有刪除功能
					right={(
						<IconButton
							type={CLOSE_CIRCLE_FILL}
							color={IconButton.ColorEnums.GREY}
							className="btn-remove"
							onClick={() => this.setState({
								isMessageModalVisible: true,
							})}
						/>
					)}
				/>
			</div>
		);
	}

	render() {
		const {
			orders,
			isMessageModalVisible,
		} = this.state;
		const {
			_handleRemoveOrder,
			_handleCloseMessageModal,
			_renderItems,
		} = this;
		const {
			hasPagination,
		} = this.props;

		return (
			<div className={PREFIX_CLASS}>
				<SearchForm/>
				<div className={`${PREFIX_CLASS}__orders filtered-orders`}>
					<List
						orders={orders}
						renderItems={item => _renderItems(item)}
						hasPagination={hasPagination}
					/>
				</div>
				<Modal.Message
					visible={isMessageModalVisible}
					message="确定要删除？"
					onClickOk={_handleRemoveOrder}
					onClickCancel={_handleCloseMessageModal}
					className={`${PAGE_PREFIX_CLASS}__confirm-modal`}
				/>
			</div>
		);
	}
}

OrderList.propTypes = propTypes;
OrderList.defaultProps = defaultProps;

export default OrderList;

// Todo remove after api is ready
function generateFakeData() {
	let index = 0;
	const result = [];

	for (index; index < 25; index += 1) {
		result.push({
			id: `${index}`,
			createdAt: '2020-05-22T05:53:25.689Z',
			tags: [
				{
					id: '5ec5f60b25fbb049dbd231e2',
					name: `标签${index}`,
					backgroundColor: 'FBC8D9',
					fontColor: 'CD349D',
				},
			],
			owner: {
				id: '5ec5f60b25fbb049dbd231e2',
				displayName: '开单人员 A',
			},
			handler: {
				id: '5ec5f60b25fbb049dbd231e2',
				displayName: '接单人员 A',
			},
			customerName: '成员一',
			status: 'accepted',
		});
	}

	return result;
}
