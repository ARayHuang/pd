import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'ljit-store-connecter';
import {
	ListItem,
	Icon,
} from 'ljit-react-components';
import SearchForm from '../../../../components/search-form';
import Tag from '../../../../components/tag';
import OrderSteps from '../../../../components/order-steps';
import List from '../../../../components/list';
import CopyableText from '../../../../components/copyable-text';
import { formatDate } from '../../../../../lib/moment-utils';
import {
	OrdersPropTypes,
	ChannelPropTypes,
} from '../../../../lib/prop-types-utils';
import { orderActions } from '../../../../controller';
import { OrderTypeEnums, LoadingStatusEnum } from '../../../../lib/enums';
import { TagsPropTypes } from '../../../../lib/prop-types-utils';
import { checkHasOrderById } from '../../utils';
import './styles.styl';

const {
	fetchClosedOrdersAction,
	setSelectedOrderIdAction,
	resetSelectedOrderIdAction,
	setClosedSearchQueriesAction,
} = orderActions;
const {
	LOADING,
	SUCCESS,
} = LoadingStatusEnum;
const {
	PROCESSING,
	TRACKED,
	CLOSED,
} = OrderTypeEnums;
const {
	USER_OUTLINE,
	CALENDAR,
	CHECK_CIRCEL,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const propTypes = {
	ordersData: OrdersPropTypes,
	selectedChannel: ChannelPropTypes,
	tags: TagsPropTypes,
	nextPage: PropTypes.number,
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	fetchClosedOrdersAction: PropTypes.func.isRequired,
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	setClosedSearchQueriesAction: PropTypes.func.isRequired,
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	closedSearchQueries: PropTypes.object,
};
const defaultProps = {
	ordersData: {},
	tags: [],
};
const PREFIX_CLASS = 'closed-orders';
const DEFAULT_PAGE = 1;

class ClosedOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOrderId: '',
		};

		this._handleSelectedOrderId = this._handleSelectedOrderId.bind(this);
		this._handleNextPage = this._handleNextPage.bind(this);
		this._handleFetchClosedOrders = this._handleFetchClosedOrders.bind(this);
		this._renderItems = this._renderItems.bind(this);
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
	}

	_handleSelectedOrderId(selectedOrderId) {
		const { setSelectedOrderIdAction } = this.props;

		this.setState({ selectedOrderId });

		setSelectedOrderIdAction(selectedOrderId);
	}

	_handleNextPage(page) {
		const { selectedChannel, fetchClosedOrdersAction, closedSearchQueries } = this.props;
		const channelId = selectedChannel.id;

		fetchClosedOrdersAction(channelId, page, closedSearchQueries);
	}

	_handleFetchClosedOrders(closedSearchQueries) {
		const {
			selectedChannel,
			fetchClosedOrdersAction,
			setClosedSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;
		const channelId = selectedChannel.id;

		resetSelectedOrderIdAction();
		setClosedSearchQueriesAction(closedSearchQueries);
		fetchClosedOrdersAction(channelId, DEFAULT_PAGE, closedSearchQueries);
	}

	_handleCheckHasOrder() {
		const {
			ordersData,
			setSelectedOrderIdAction,
			resetSelectedOrderIdAction,
		} = this.props;
		const { selectedOrderId } = this.state;
		const orders = ordersData.orders.toArray();
		const hasOrderIndex = checkHasOrderById(selectedOrderId, orders);

		if (hasOrderIndex > -1) {
			setSelectedOrderIdAction(selectedOrderId);
		} else {
			resetSelectedOrderIdAction();
		}
	}

	_renderItems(item) {
		const { selectedOrderId } = this.state;
		const {
			id,
			tags,
			createdAt,
			customerName,
			owner,
			handler,
			status,
			completedAt,
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
					<Tag tag={tags[0]}/>
					<CopyableText prefix="No." text={description} isEllipsis/>
				</div>
				<div className="list-item-cell list-item-cell--status">
					<OrderSteps stepData={stepData} />
				</div>
				<div className="list-item-cell list-item-cell--description">
					<div><Icon type={USER_OUTLINE} size={X_SMALL}/>{customerName}</div>
					<div><Icon type={CALENDAR} size={X_SMALL}/>{formatDate(createdAt)}</div>
					<div><Icon type={CHECK_CIRCEL} size={X_SMALL}/>{completedAt ? formatDate(completedAt) : '-'}</div>
				</div>
			</div>
		);
		const isSelected = id === selectedOrderId;

		return (
			<div onClick={() => this._handleSelectedOrderId(id)}>
				<ListItem
					key={id}
					content={content}
					className={isSelected ? 'ljit-list-item--selected' : null}
				/>
			</div>
		);
	}

	render() {
		const {
			ordersData,
			tags = [],
		} = this.props;
		const {
			_renderItems,
			_handleNextPage,
			_handleFetchClosedOrders,
		} = this;
		const { numOfItems } = ordersData;

		return (
			<div className={PREFIX_CLASS}>
				<SearchForm
					tags={tags}
					tabType={CLOSED}
					numOfItems={numOfItems}
					onSearch={_handleFetchClosedOrders}
				/>
				<div className={`${PREFIX_CLASS}__orders filtered-orders`}>
					<List
						ordersData={ordersData}
						renderItems={item => _renderItems(item)}
						onChangeNextPage={_handleNextPage}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { closedSearchQueries } = this.props;

		this._handleFetchClosedOrders(closedSearchQueries);
	}

	componentDidUpdate(prevProps) {
		const {
			selectedTab,
			loadingStatus,
			closedSearchQueries,
		} = this.props;
		const {
			_handleFetchClosedOrders,
			_handleCheckHasOrder,
		} = this;
		const isSelectedCurrentTab = prevProps.selectedTab !== CLOSED && selectedTab === CLOSED;
		const isLoadingSuccess = prevProps.loadingStatus === LOADING && loadingStatus === SUCCESS;

		if (isSelectedCurrentTab) {
			_handleFetchClosedOrders(closedSearchQueries);
		}

		if (isLoadingSuccess) {
			_handleCheckHasOrder();
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selectedTab === CLOSED;
	}
}

ClosedOrders.propTypes = propTypes;
ClosedOrders.defaultProps = defaultProps;

function mapStateToProps(state) {
	const ordersReducer = state.orders;

	return {
		selectedChannel: state.channel.get('data').toObject(),
		ordersData: ordersReducer.get('data').toObject(),
		selectedTab: ordersReducer.get('selectedTab'),
		closedSearchQueries: ordersReducer.get('closedSearchQueries').toObject(),
		nextPage: ordersReducer.getIn(['data', 'page']),
		loadingStatus: ordersReducer.get('fetchClosedOrdersLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchClosedOrdersAction: (...args) => dispatch(fetchClosedOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		setClosedSearchQueriesAction: closedSearchQueries => dispatch(setClosedSearchQueriesAction(closedSearchQueries)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedOrders);
