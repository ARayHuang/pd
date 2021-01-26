import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'ljit-store-connecter';
import ConsumerSearchForm from '../../../../components/consumer-search-form';
import FilteredList from '../filtered-list';
import {
	MePropTypes,
	OrdersPropTypes,
} from '../../../../lib/prop-types-utils';
import {
	OrderTypeEnums,
	LoadingStatusEnum,
} from '../../../../lib/enums';
import {
	orderActions,
	consumerOrderActions,
} from '../../../../controller';
import { checkHasOrderById } from '../../utils';

const {
	setSelectedOrderIdAction,
	resetSelectedOrderIdAction,
} = orderActions;
const {
	fetchConsumerTrackedOrdersAction,
	setConsumerTrackedSearchQueriesAction,
} = consumerOrderActions;
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
	nextPage: PropTypes.number,
	selectedOrderId: PropTypes.string,
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	deleteOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	completeOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	fetchConsumerTrackedOrdersAction: PropTypes.func.isRequired,
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	setConsumerTrackedSearchQueriesAction: PropTypes.func.isRequired,
	trackedSearchQueries: PropTypes.object,
};
const defaultProps = {
	ordersData: {},
};
const PREFIX_CLASS = 'tracked-orders';
const DEFAULT_PAGE = 1;

class TrackedOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOrderId: '',
		};

		this._handleSelectedOrderId = this._handleSelectedOrderId.bind(this);
		this._handleNextPage = this._handleNextPage.bind(this);
		this._handleFetchTrackedOrders = this._handleFetchTrackedOrders.bind(this);
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
	}

	_handleSelectedOrderId(selectedOrderId) {
		const { setSelectedOrderIdAction } = this.props;

		this.setState({ selectedOrderId });

		setSelectedOrderIdAction(selectedOrderId);
	}

	_handleNextPage(page) {
		const { fetchConsumerTrackedOrdersAction } = this.props;
		const { trackedSearchQueries } = this.props;

		fetchConsumerTrackedOrdersAction(page, trackedSearchQueries);
	}

	_handleFetchTrackedOrders(trackedSearchQueries) {
		const {
			fetchConsumerTrackedOrdersAction,
			setConsumerTrackedSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;

		resetSelectedOrderIdAction();
		setConsumerTrackedSearchQueriesAction(trackedSearchQueries);
		fetchConsumerTrackedOrdersAction(DEFAULT_PAGE, trackedSearchQueries);
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
		} = this.props;
		const {
			_handleSelectedOrderId,
			_handleNextPage,
			_handleFetchTrackedOrders,
		} = this;
		const { numOfItems } = ordersData;
		const userId = meData.id;

		return (
			<div className={PREFIX_CLASS}>
				<ConsumerSearchForm
					tabType={TRACKED}
					numOfItems={numOfItems}
					onSearch={_handleFetchTrackedOrders}
				/>
				<div className={cx(`${PREFIX_CLASS}__orders`, 'filtered-orders')}>
					<FilteredList
						userId={userId}
						ordersData={ordersData}
						selectedOrderId={selectedOrderId}
						onSelectedOrderId={_handleSelectedOrderId}
						onChangeNextPage={_handleNextPage}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { trackedSearchQueries } = this.props;

		this._handleFetchTrackedOrders(trackedSearchQueries);
	}

	componentDidUpdate(prevProps) {
		const {
			selectedTab,
			deleteOrderLoadingStatus,
			completeOrderLoadingStatus,
			loadingStatus,
			trackedSearchQueries,
		} = this.props;
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
	const consumerOrdersReducer = state.consumerOrders;
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		ordersData: consumerOrdersReducer.get('data').toObject(),
		selectedTab: consumerOrdersReducer.get('selectedTab'),
		nextPage: consumerOrdersReducer.getIn(['data', 'page']),
		loadingStatus: consumerOrdersReducer.get('fetchConsumerTrackedOrdersLoadingStatus'),
		trackedSearchQueries: consumerOrdersReducer.get('trackedSearchQueries').toObject(),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		deleteOrderLoadingStatus: orderReducer.get('deleteOrderLoadingStatus'),
		completeOrderLoadingStatus: orderReducer.get('completeOrderLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchConsumerTrackedOrdersAction: (...args) => dispatch(fetchConsumerTrackedOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		setConsumerTrackedSearchQueriesAction: trackedSearchQueries => dispatch(setConsumerTrackedSearchQueriesAction(trackedSearchQueries)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackedOrders);
