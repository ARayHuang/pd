import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import SearchForm from '../../../../components/search-form';
import FilteredList from '../filtered-list';
import {
	MePropTypes,
	OrdersPropTypes,
	ChannelPropTypes,
	TagsPropTypes,
} from '../../../../lib/prop-types-utils';
import {
	OrderTypeEnums,
	LoadingStatusEnum,
} from '../../../../lib/enums';
import { orderActions } from '../../../../controller';
import { checkHasOrderById } from '../../utils';

const {
	fetchTrackedOrdersAction,
	setSelectedOrderIdAction,
	resetSelectedOrderIdAction,
	deleteOrderAction,
	setTrackedSearchQueriesAction,
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
const propTypes = {
	meData: MePropTypes.isRequired,
	ordersData: OrdersPropTypes,
	selectedChannel: ChannelPropTypes,
	tags: TagsPropTypes,
	nextPage: PropTypes.number,
	selectedOrderId: PropTypes.string,
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	deleteOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	completeOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	fetchTrackedOrdersAction: PropTypes.func.isRequired,
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	deleteOrderAction: PropTypes.func.isRequired,
	setTrackedSearchQueriesAction: PropTypes.func.isRequired,
	trackedSearchQueries: PropTypes.object,
};
const defaultProps = {
	ordersData: {},
	tags: [],
};
const PREFIX_CLASS = 'tracked-orders';
const DEFAULT_PAGE = 1;

class TrackedOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOrderId: '',
		};

		this._handleRemoveOrder = this._handleRemoveOrder.bind(this);
		this._handleSelectedOrderId = this._handleSelectedOrderId.bind(this);
		this._handleNextPage = this._handleNextPage.bind(this);
		this._handleFetchTrackedOrders = this._handleFetchTrackedOrders.bind(this);
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
	}

	_handleRemoveOrder(selectedOrderId) {
		const {
			selectedChannel,
			deleteOrderAction,
		} = this.props;
		const channelId = selectedChannel.id;

		deleteOrderAction(channelId, selectedOrderId);
	}

	_handleSelectedOrderId(selectedOrderId) {
		const { setSelectedOrderIdAction } = this.props;

		this.setState({ selectedOrderId });

		setSelectedOrderIdAction(selectedOrderId);
	}

	_handleNextPage(page) {
		const { selectedChannel, fetchTrackedOrdersAction } = this.props;
		const { trackedSearchQueries } = this.state;
		const channelId = selectedChannel.id;

		fetchTrackedOrdersAction(channelId, page, trackedSearchQueries);
	}

	_handleFetchTrackedOrders(trackedSearchQueries) {
		const {
			selectedChannel,
			fetchTrackedOrdersAction,
			setTrackedSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;
		const channelId = selectedChannel.id;

		resetSelectedOrderIdAction();
		setTrackedSearchQueriesAction(trackedSearchQueries);
		fetchTrackedOrdersAction(channelId, DEFAULT_PAGE, trackedSearchQueries);
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

	render() {
		const {
			meData,
			ordersData,
			selectedOrderId,
			tags = [],
		} = this.props;
		const {
			_handleRemoveOrder,
			_handleSelectedOrderId,
			_handleNextPage,
			_handleFetchTrackedOrders,
		} = this;
		const { numOfItems } = ordersData;
		const userId = meData.id;

		return (
			<div className={PREFIX_CLASS}>
				<SearchForm
					tags={tags}
					tabType={TRACKED}
					numOfItems={numOfItems}
					onSearch={_handleFetchTrackedOrders}
				/>
				<div className={`${PREFIX_CLASS}__orders filtered-orders`}>
					<FilteredList
						userId={userId}
						ordersData={ordersData}
						selectedOrderId={selectedOrderId}
						onRemoveOrder={_handleRemoveOrder}
						onSelectedOrderId={_handleSelectedOrderId}
						onChangeNextPage={_handleNextPage}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { trackedSearchQueries } = this.state;

		this._handleFetchTrackedOrders(trackedSearchQueries);
	}

	componentDidUpdate(prevProps) {
		const {
			selectedTab,
			deleteOrderLoadingStatus,
			completeOrderLoadingStatus,
			loadingStatus,
		} = this.props;
		const { trackedSearchQueries } = this.props;
		const {
			_handleFetchTrackedOrders,
			_handleCheckHasOrder,
		} = this;
		const isSelectedCurrentTab = prevProps.selectedTab !== TRACKED &&
		selectedTab === TRACKED;
		const isDeleteOrderSuccess = prevProps.deleteOrderLoadingStatus === LOADING &&
		deleteOrderLoadingStatus === SUCCESS;
		const isCompleteOrderSuccess = prevProps.completeOrderLoadingStatus === LOADING && completeOrderLoadingStatus === SUCCESS;
		const isLoadingSuccess = prevProps.loadingStatus === LOADING && loadingStatus === SUCCESS;

		if (isSelectedCurrentTab) {
			_handleFetchTrackedOrders(trackedSearchQueries);
		}

		if (isLoadingSuccess) {
			_handleCheckHasOrder();
		}

		if (isCompleteOrderSuccess ||
			isDeleteOrderSuccess
		) {
			this.setState({ selectedOrderId: '' });
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selectedTab === TRACKED;
	}
}

TrackedOrders.propTypes = propTypes;
TrackedOrders.defaultProps = defaultProps;

function mapStateToProps(state) {
	const ordersReducer = state.orders;
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		selectedChannel: state.channel.get('data').toObject(),
		ordersData: ordersReducer.get('data').toObject(),
		selectedTab: ordersReducer.get('selectedTab'),
		nextPage: ordersReducer.getIn(['data', 'page']),
		loadingStatus: ordersReducer.get('fetchTrackedOrdersLoadingStatus'),
		trackedSearchQueries: ordersReducer.get('trackedSearchQueries').toObject(),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		deleteOrderLoadingStatus: orderReducer.get('deleteOrderLoadingStatus'),
		completeOrderLoadingStatus: orderReducer.get('completeOrderLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchTrackedOrdersAction: (...args) => dispatch(fetchTrackedOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		deleteOrderAction: (...args) => dispatch(deleteOrderAction(...args)),
		setTrackedSearchQueriesAction: trackedSearchQueries => dispatch(setTrackedSearchQueriesAction(trackedSearchQueries)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackedOrders);
