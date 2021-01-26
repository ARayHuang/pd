import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'ljit-store-connecter';
import FilteredList from '../filtered-list';
import ConsumerSearchForm from '../../../../components/consumer-search-form';
import { OrderTypeEnums, LoadingStatusEnum } from '../../../../lib/enums';
import { MePropTypes, OrdersPropTypes } from '../../../../lib/prop-types-utils';
import { orderActions, consumerOrderActions } from '../../../../controller';
import { checkHasOrderById } from '../../utils';
import './styles.styl';

const {
	setSelectedOrderIdAction,
	resetSelectedOrderIdAction,
} = orderActions;
const {
	fetchConsumerClosedOrdersAction,
	setConsumerClosedSearchQueriesAction,
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
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	fetchConsumerClosedOrdersAction: PropTypes.func.isRequired,
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	selectedOrderId: PropTypes.string,
	setConsumerClosedSearchQueriesAction: PropTypes.func.isRequired,
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	closedSearchQueries: PropTypes.object,
};
const defaultProps = {
	ordersData: {},
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
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
	}

	_handleSelectedOrderId(selectedOrderId) {
		const { setSelectedOrderIdAction } = this.props;

		this.setState({ selectedOrderId });

		setSelectedOrderIdAction(selectedOrderId);
	}

	_handleNextPage(page) {
		const { fetchConsumerClosedOrdersAction, closedSearchQueries } = this.props;

		fetchConsumerClosedOrdersAction(page, closedSearchQueries);
	}

	_handleFetchClosedOrders(closedSearchQueries) {
		const {
			fetchConsumerClosedOrdersAction,
			setConsumerClosedSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;

		resetSelectedOrderIdAction();
		setConsumerClosedSearchQueriesAction(closedSearchQueries);
		fetchConsumerClosedOrdersAction(DEFAULT_PAGE, closedSearchQueries);
	}

	_handleCheckHasOrder() {
		const {
			ordersData,
			setSelectedOrderIdAction,
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
			selectedOrderId,
			ordersData,
		} = this.props;
		const {
			_handleNextPage,
			_handleFetchClosedOrders,
			_handleSelectedOrderId,
		} = this;
		const { numOfItems } = ordersData;
		const { id: userId } = meData;

		return (
			<div className={PREFIX_CLASS}>
				<ConsumerSearchForm
					tabType={CLOSED}
					numOfItems={numOfItems}
					onSearch={_handleFetchClosedOrders}
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
	const consumerOrdersReducer = state.consumerOrders;
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		ordersData: consumerOrdersReducer.get('data').toObject(),
		selectedTab: consumerOrdersReducer.get('selectedTab'),
		nextPage: consumerOrdersReducer.getIn(['data', 'page']),
		loadingStatus: consumerOrdersReducer.get('fetchConsumerClosedOrdersLoadingStatus'),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		closedSearchQueries: consumerOrdersReducer.get('closedSearchQueries').toObject(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchConsumerClosedOrdersAction: (...args) => dispatch(fetchConsumerClosedOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		setConsumerClosedSearchQueriesAction: closedSearchQueries => dispatch(setConsumerClosedSearchQueriesAction(closedSearchQueries)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedOrders);
