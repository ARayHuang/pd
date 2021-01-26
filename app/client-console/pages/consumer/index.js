import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'ljit-react-components';
import { connect } from 'ljit-store-connecter';
import Sidebar from './sidebar';
import ConsumerOrderList from '../../features/order/consumer-list';
import OrderDetail from '../../features/order/detail';
import InvitationModal from '../../features/invitation-modal';
import { MePropTypes, OrderPropTypes } from '../../lib/prop-types-utils';
import {
	applicationActions,
	orderActions,
	createdOrdersActions,
	consumerOrderActions,
	orderSocketActions,
} from '../../controller';
import { LoadingStatusEnum, OrderTypeEnums } from '../../lib/enums';
import '../../styling/layout/styles.styl';

const { initializeConsumerApplicationAction } = applicationActions;
const { removeInvitationAction } = orderSocketActions;
const {
	acceptOrderAction,
} = orderActions;
const {
	fetchCreatedOrdersAction,
	fetchNextCreatedOrdersAction,
} = createdOrdersActions;
const {
	setConsumerSelectedTabAction,
} = consumerOrderActions;
const { LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const propTypes = {
	meData: MePropTypes,
	numOfCreatedOrdersItems: PropTypes.number,
	numOfCreatedOrdersPages: PropTypes.number,
	currentCreatedOrdersPages: PropTypes.number,
	createdOrdersData: PropTypes.arrayOf(OrderPropTypes),
	initializeConsumerApplicationAction: PropTypes.func.isRequired,
	acceptOrderAction: PropTypes.func.isRequired,
	fetchCreatedOrdersAction: PropTypes.func.isRequired,
	fetchNextCreatedOrdersAction: PropTypes.func.isRequired,
	setConsumerSelectedTabAction: PropTypes.func.isRequired,
	createdOrdersLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
	acceptOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
	acceptInvitationOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
	invitations: PropTypes.array.isRequired,
	removeInvitationAction: PropTypes.func.isRequired,
};
const defaultProps = {
	meData: {},
};

class ConsumerPage extends Component {
	constructor() {
		super();

		this._handleAcceptOrder = this._handleAcceptOrder.bind(this);
	}

	_handleAcceptOrder({ channel, id }) {
		this.props.acceptOrderAction(channel.id, id);
	}

	render() {
		const {
			props,
			_handleAcceptOrder,
		} = this;
		const {
			meData,
			createdOrdersData,
			numOfCreatedOrdersItems,
		} = props;
		const { departmentType, displayName, profilePictureId } = meData;

		return (
			<Layout className="consumer">
				<Sidebar
					displayName={displayName}
					profilePictureId={profilePictureId}
					count={numOfCreatedOrdersItems}
					createdOrders={createdOrdersData}
					onDoubleClick={_handleAcceptOrder}
				/>
				<Layout className="layout__left">
					<ConsumerOrderList/>
				</Layout>
				<Layout className="layout__right">
					<OrderDetail departmentType={departmentType}/>
				</Layout>
				<InvitationModal />
			</Layout>
		);
	}

	componentDidUpdate(prevProp) {
		const {
			numOfCreatedOrdersPages,
			currentCreatedOrdersPages,
			fetchCreatedOrdersAction,
			fetchNextCreatedOrdersAction,
			createdOrdersLoadingStatus,
			acceptOrderLoadingStatus,
			setConsumerSelectedTabAction,
			acceptInvitationOrderLoadingStatus,
			removeInvitationAction,
			invitations,
		} = this.props;
		const fetchCreatedOrdersSuccess = createdOrdersLoadingStatus === SUCCESS;

		if (fetchCreatedOrdersSuccess && numOfCreatedOrdersPages > currentCreatedOrdersPages) {
			fetchNextCreatedOrdersAction(currentCreatedOrdersPages + 1);
		}

		if (prevProp.acceptOrderLoadingStatus === LOADING && acceptOrderLoadingStatus === SUCCESS) {
			fetchCreatedOrdersAction();
			setConsumerSelectedTabAction(OrderTypeEnums.PROCESSING);
		}

		if (prevProp.acceptInvitationOrderLoadingStatus === LOADING && invitations.length) {
			const [firstInvitation = {}] = invitations;
			const { id } = firstInvitation;

			if (acceptInvitationOrderLoadingStatus === SUCCESS) {
				setConsumerSelectedTabAction(OrderTypeEnums.PROCESSING);
				removeInvitationAction(id);
			}

			if (acceptInvitationOrderLoadingStatus === FAILED) {
				removeInvitationAction(id);
			}
		}
	}

	componentDidMount() {
		const { initializeConsumerApplicationAction } = this.props;

		initializeConsumerApplicationAction();
	}
}

ConsumerPage.propTypes = propTypes;
ConsumerPage.defaultProps = defaultProps;

function mapStateToProps(state) {
	return {
		meData: state.auth.get('me').toObject(),
		createdOrdersData: state.createdOrders.getIn(['data', 'orders']).toArray(),
		numOfCreatedOrdersItems: state.createdOrders.getIn(['data', 'numOfItems']),
		numOfCreatedOrdersPages: state.createdOrders.getIn(['data', 'numOfPages']),
		currentCreatedOrdersPages: state.createdOrders.getIn(['data', 'page']),
		createdOrdersLoadingStatus: state.createdOrders.get('loadingStatus'),
		acceptOrderLoadingStatus: state.order.get('acceptOrderLoadingStatus'),
		invitations: state.invitations.get('data').toArray(),
		acceptInvitationOrderLoadingStatus: state.order.get('acceptInvitationOrderLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		initializeConsumerApplicationAction: () => dispatch(initializeConsumerApplicationAction()),
		acceptOrderAction: (channelId, orderId) => dispatch(acceptOrderAction(channelId, orderId)),
		fetchCreatedOrdersAction: () => dispatch(fetchCreatedOrdersAction()),
		fetchNextCreatedOrdersAction: page => dispatch(fetchNextCreatedOrdersAction(page)),
		setConsumerSelectedTabAction: tabKey => dispatch(setConsumerSelectedTabAction(tabKey)),
		removeInvitationAction: id => dispatch(removeInvitationAction(id)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerPage);
