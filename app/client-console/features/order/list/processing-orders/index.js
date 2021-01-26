import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
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
	LoadingStatusEnum,
	OrderTypeEnums,
} from '../../../../lib/enums';
import { orderActions } from '../../../../controller';
import { checkHasOrderById } from '../../utils';

const {
	fetchProcessingOrdersAction,
	fetchNextProcessingOrdersAction,
	setSelectedOrderIdAction,
	deleteOrderAction,
	resetSelectedOrderIdAction,
	setProcessingSearchQueriesAction,
	removeAcceptedInvitationAction,
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
	page: PropTypes.number,
	numOfPages: PropTypes.number,
	tags: TagsPropTypes,
	selectedOrderId: PropTypes.string,
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	deleteOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	completeOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	trackOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	createOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	fetchProcessingOrdersAction: PropTypes.func.isRequired,
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	fetchNextProcessingOrdersAction: PropTypes.func.isRequired,
	deleteOrderAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	setProcessingSearchQueriesAction: PropTypes.func.isRequired,
	processingSearchQueries: PropTypes.object,
	acceptedInvitation: PropTypes.array.isRequired,
	removeAcceptedInvitationAction: PropTypes.func.isRequired,
};
const defaultProps = {
	ordersData: {},
	selectedChannel: {},
	tags: [],
};
const PREFIX_CLASS = 'processing-orders';
const DEFAULT_PAGE = 1;

class ProcessingOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOrderId: '',
		};

		this._handleRemoveOrder = this._handleRemoveOrder.bind(this);
		this._handleSelectedOrderId = this._handleSelectedOrderId.bind(this);
		this._handleFetchProcessingOrders = this._handleFetchProcessingOrders.bind(this);
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
		this._handleFetchNextOrders = this._handleFetchNextOrders.bind(this);
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

	_handleFetchProcessingOrders(processingSearchQueries) {
		const {
			selectedChannel,
			fetchProcessingOrdersAction,
			setProcessingSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;
		const channelId = selectedChannel.id;

		resetSelectedOrderIdAction();
		setProcessingSearchQueriesAction(processingSearchQueries);
		fetchProcessingOrdersAction(channelId, DEFAULT_PAGE, processingSearchQueries);
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

	_handleFetchNextOrders() {
		const { page, selectedChannel, fetchNextProcessingOrdersAction, processingSearchQueries } = this.props;
		const nextPage = page + 1;

		fetchNextProcessingOrdersAction(selectedChannel.id, nextPage, processingSearchQueries);
	}

	render() {
		const {
			meData,
			ordersData,
			selectedOrderId,
			tags = [],
		} = this.props;
		const {
			_handleSelectedOrderId,
			_handleRemoveOrder,
			_handleFetchProcessingOrders,
		} = this;
		const { numOfItems } = ordersData;
		const userId = meData.id;

		return (
			<div className={PREFIX_CLASS}>
				<SearchForm
					tags={tags}
					tabType={PROCESSING}
					numOfItems={numOfItems}
					onSearch={_handleFetchProcessingOrders}
				/>
				<div className={cx(`${PREFIX_CLASS}__orders`, 'filtered-orders')}
				>
					<FilteredList
						userId={userId}
						ordersData={ordersData}
						hasPagination={false}
						selectedOrderId={selectedOrderId}
						onRemoveOrder={_handleRemoveOrder}
						onSelectedOrderId={_handleSelectedOrderId}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { processingSearchQueries } = this.props;

		this._handleFetchProcessingOrders(processingSearchQueries);
	}

	componentDidUpdate(prevProps) {
		const {
			selectedTab,
			page,
			numOfPages,
			loadingStatus,
			deleteOrderLoadingStatus,
			completeOrderLoadingStatus,
			trackOrderLoadingStatus,
			createOrderLoadingStatus,
			selectedOrderId: reducerSelectedOrderId,
			acceptedInvitation,
			setSelectedOrderIdAction,
			removeAcceptedInvitationAction,
		} = this.props;
		const { processingSearchQueries } = this.props;
		const {
			_handleFetchProcessingOrders,
			_handleCheckHasOrder,
			_handleFetchNextOrders,
		} = this;
		const isSelectedCurrentTab = prevProps.selectedTab !== PROCESSING &&
		selectedTab === PROCESSING;
		const isDeleteOrderSuccess = prevProps.deleteOrderLoadingStatus === LOADING &&
		deleteOrderLoadingStatus === SUCCESS;
		const isCompleteOrderSuccess = prevProps.completeOrderLoadingStatus === LOADING && completeOrderLoadingStatus === SUCCESS;
		const isTrackOrderSuccess = prevProps.trackOrderLoadingStatus === LOADING && trackOrderLoadingStatus === SUCCESS;
		const isCreateOrderSuccess = prevProps.createOrderLoadingStatus === LOADING && createOrderLoadingStatus === SUCCESS;
		const isLoadingSuccess = prevProps.loadingStatus === LOADING && loadingStatus === SUCCESS;

		if (isSelectedCurrentTab) {
			_handleFetchProcessingOrders(processingSearchQueries);
		}

		if (isLoadingSuccess) {
			if (acceptedInvitation.length) {
				const [{ orderId, invitationType } = {}] = acceptedInvitation;

				this.setState({ selectedOrderId: orderId });
				setSelectedOrderIdAction(orderId);
				removeAcceptedInvitationAction(invitationType, orderId);
			} else {
				_handleCheckHasOrder();
			}

			if (page < numOfPages) {
				_handleFetchNextOrders();
			}
		}

		if (isCompleteOrderSuccess ||
			isTrackOrderSuccess ||
			isDeleteOrderSuccess
		) {
			this.setState({ selectedOrderId: '' });
		}

		if (isCreateOrderSuccess) {
			this.setState({ selectedOrderId: reducerSelectedOrderId });
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selectedTab === PROCESSING;
	}
}

ProcessingOrders.propTypes = propTypes;
ProcessingOrders.defaultProps = defaultProps;

function mapStateToProps(state) {
	const ordersReducer = state.orders;
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		selectedChannel: state.channel.get('data').toObject(),
		selectedTab: ordersReducer.get('selectedTab'),
		ordersData: ordersReducer.get('data').toObject(),
		processingSearchQueries: ordersReducer.get('processingSearchQueries').toObject(),
		page: ordersReducer.getIn(['data', 'page']),
		numOfPages: ordersReducer.getIn(['data', 'numOfPages']),
		loadingStatus: ordersReducer.get('fetchProcessingOrdersLoadingStatus'),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		deleteOrderLoadingStatus: orderReducer.get('deleteOrderLoadingStatus'),
		trackOrderLoadingStatus: orderReducer.get('trackOrderLoadingStatus'),
		completeOrderLoadingStatus: orderReducer.get('completeOrderLoadingStatus'),
		createOrderLoadingStatus: orderReducer.get('createOrderLoadingStatus'),
		acceptedInvitation: state.invitations.get('acceptedInvitation').toArray(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchProcessingOrdersAction: (...args) => dispatch(fetchProcessingOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		fetchNextProcessingOrdersAction: (...args) => dispatch(fetchNextProcessingOrdersAction(...args)),
		deleteOrderAction: (...args) => dispatch(deleteOrderAction(...args)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		setProcessingSearchQueriesAction: processingSearchQueries => dispatch(setProcessingSearchQueriesAction(processingSearchQueries)),
		removeAcceptedInvitationAction: (...args) => dispatch(removeAcceptedInvitationAction(...args)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingOrders);
