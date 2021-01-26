import React, { Component, createRef } from 'react';
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
	LoadingStatusEnum,
	OrderTypeEnums,
} from '../../../../lib/enums';
import {
	orderActions,
	consumerOrderActions,
} from '../../../../controller';
import { checkHasOrderById } from '../../utils';

const {
	setSelectedOrderIdAction,
	deleteOrderAction,
	resetSelectedOrderIdAction,
	removeAcceptedInvitationAction,
} = orderActions;
const {
	fetchConsumerProcessingOrdersAction,
	fetchConsumerNextProcessingOrdersAction,
	setConsumerProcessingSearchQueriesAction,
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
	isShowOnlyMyOrders: PropTypes.bool,
	meData: MePropTypes.isRequired,
	ordersData: OrdersPropTypes,
	page: PropTypes.number,
	numOfPages: PropTypes.number,
	selectedOrderId: PropTypes.string,
	selectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	loadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	deleteOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	completeOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	trackOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	createOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	acceptOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	acceptInvitationOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
	setSelectedOrderIdAction: PropTypes.func.isRequired,
	fetchConsumerProcessingOrdersAction: PropTypes.func.isRequired,
	fetchConsumerNextProcessingOrdersAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	setConsumerProcessingSearchQueriesAction: PropTypes.func.isRequired,
	processingSearchQueries: PropTypes.object,
	removeAcceptedInvitationAction: PropTypes.func.isRequired,
	acceptedInvitation: PropTypes.array.isRequired,
};
const defaultProps = {
	ordersData: {},
};
const PREFIX_CLASS = 'processing-orders';
const DEFAULT_PAGE = 1;

class ProcessingOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOrderId: '',
		};
		this.listScrollRef = createRef();

		this._handleSelectedOrderId = this._handleSelectedOrderId.bind(this);
		this._handleFetchProcessingOrders = this._handleFetchProcessingOrders.bind(this);
		this._handleCheckHasOrder = this._handleCheckHasOrder.bind(this);
		this._handleFetchNextOrders = this._handleFetchNextOrders.bind(this);
	}

	_handleSelectedOrderId(selectedOrderId) {
		const { setSelectedOrderIdAction } = this.props;

		this.setState({ selectedOrderId });

		setSelectedOrderIdAction(selectedOrderId);
	}

	_handleFetchProcessingOrders({ handlerId, ...restQueries }) {
		const {
			isShowOnlyMyOrders,
			meData,
			fetchConsumerProcessingOrdersAction,
			setConsumerProcessingSearchQueriesAction,
			resetSelectedOrderIdAction,
		} = this.props;
		const { id: nextHandlerId } = meData;
		let processingSearchQueries = Object.assign({}, restQueries);

		if (isShowOnlyMyOrders) {
			processingSearchQueries = {
				...restQueries,
				handlerId: nextHandlerId,
			};
		}

		resetSelectedOrderIdAction();
		setConsumerProcessingSearchQueriesAction(processingSearchQueries);
		fetchConsumerProcessingOrdersAction(DEFAULT_PAGE, processingSearchQueries);
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
		const { page, fetchConsumerNextProcessingOrdersAction, processingSearchQueries } = this.props;
		const nextPage = page + 1;

		fetchConsumerNextProcessingOrdersAction(nextPage, processingSearchQueries);
	}

	render() {
		const {
			meData,
			ordersData,
			selectedOrderId,
		} = this.props;
		const {
			listScrollRef,
			_handleSelectedOrderId,
			_handleFetchProcessingOrders,
		} = this;
		const { numOfItems } = ordersData;
		const userId = meData.id;

		return (
			<div className={PREFIX_CLASS}>
				<ConsumerSearchForm
					tabType={PROCESSING}
					numOfItems={numOfItems}
					onSearch={_handleFetchProcessingOrders}
					ref={ref => {
						this.HandlerSearchFormRef = ref;
					}}
				/>
				<div className={cx(`${PREFIX_CLASS}__orders`, 'filtered-orders')}
				>
					<FilteredList
						userId={userId}
						ordersData={ordersData}
						hasPagination={false}
						selectedOrderId={selectedOrderId}
						onSelectedOrderId={_handleSelectedOrderId}
						scrollRefProps={listScrollRef}
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
			isShowOnlyMyOrders,
			selectedTab,
			page,
			numOfPages,
			loadingStatus,
			deleteOrderLoadingStatus,
			completeOrderLoadingStatus,
			trackOrderLoadingStatus,
			createOrderLoadingStatus,
			acceptOrderLoadingStatus,
			setConsumerProcessingSearchQueriesAction,
			processingSearchQueries,
			selectedOrderId: reducerSelectedOrderId,
			acceptedInvitation,
			removeAcceptedInvitationAction,
			setSelectedOrderIdAction,
		} = this.props;
		const {
			listScrollRef,
			_handleSelectedOrderId,
			_handleFetchProcessingOrders,
			_handleCheckHasOrder,
			_handleFetchNextOrders,
		} = this;
		const { handlerId } = processingSearchQueries;
		const isShowOnlyMyOrdersToggled = prevProps.isShowOnlyMyOrders !== isShowOnlyMyOrders;
		const isSelectedCurrentTab = prevProps.selectedTab !== PROCESSING &&
		selectedTab === PROCESSING;
		const isDeleteOrderSuccess = prevProps.deleteOrderLoadingStatus === LOADING &&
		deleteOrderLoadingStatus === SUCCESS;
		const isCompleteOrderSuccess = prevProps.completeOrderLoadingStatus === LOADING && completeOrderLoadingStatus === SUCCESS;
		const isTrackOrderSuccess = prevProps.trackOrderLoadingStatus === LOADING && trackOrderLoadingStatus === SUCCESS;
		const isCreateOrderSuccess = prevProps.createOrderLoadingStatus === LOADING && createOrderLoadingStatus === SUCCESS;
		const isLoadingSuccess = prevProps.loadingStatus === LOADING && loadingStatus === SUCCESS;
		const isAcceptOrderSuccess = prevProps.acceptOrderLoadingStatus === LOADING && acceptOrderLoadingStatus === SUCCESS;

		if (isSelectedCurrentTab || isShowOnlyMyOrdersToggled) {
			_handleFetchProcessingOrders(processingSearchQueries);
		}

		if (listScrollRef.current) {
			listScrollRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
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

		if (isAcceptOrderSuccess) {
			const { formInstance = {} } = this.HandlerSearchFormRef;
			const { processing: processingForm = {} } = formInstance;
			const { resetFields = () => {} } = processingForm;

			setConsumerProcessingSearchQueriesAction({ handlerId });
			resetFields();
			_handleSelectedOrderId(reducerSelectedOrderId);
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selectedTab === PROCESSING;
	}
}

ProcessingOrders.propTypes = propTypes;
ProcessingOrders.defaultProps = defaultProps;

function mapStateToProps(state) {
	const consumerOrdersReducer = state.consumerOrders;
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		selectedTab: consumerOrdersReducer.get('selectedTab'),
		ordersData: consumerOrdersReducer.get('data').toObject(),
		page: consumerOrdersReducer.getIn(['data', 'page']),
		numOfPages: consumerOrdersReducer.getIn(['data', 'numOfPages']),
		loadingStatus: consumerOrdersReducer.get('fetchConsumerProcessingOrdersLoadingStatus'),
		processingSearchQueries: consumerOrdersReducer.get('processingSearchQueries').toObject(),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		deleteOrderLoadingStatus: orderReducer.get('deleteOrderLoadingStatus'),
		trackOrderLoadingStatus: orderReducer.get('trackOrderLoadingStatus'),
		completeOrderLoadingStatus: orderReducer.get('completeOrderLoadingStatus'),
		createOrderLoadingStatus: orderReducer.get('createOrderLoadingStatus'),
		acceptOrderLoadingStatus: orderReducer.get('acceptOrderLoadingStatus'),
		acceptInvitationOrderLoadingStatus: orderReducer.get('acceptInvitationOrderLoadingStatus'),
		acceptedInvitation: state.invitations.get('acceptedInvitation').toArray(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchConsumerProcessingOrdersAction: (...args) => dispatch(fetchConsumerProcessingOrdersAction(...args)),
		fetchConsumerNextProcessingOrdersAction: (...args) => dispatch(fetchConsumerNextProcessingOrdersAction(...args)),
		setSelectedOrderIdAction: id => dispatch(setSelectedOrderIdAction(id)),
		deleteOrderAction: (...args) => dispatch(deleteOrderAction(...args)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		setConsumerProcessingSearchQueriesAction: processingSearchQueries => dispatch(setConsumerProcessingSearchQueriesAction(processingSearchQueries)),
		removeAcceptedInvitationAction: (...args) => dispatch(removeAcceptedInvitationAction(...args)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingOrders);
