import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Layout } from 'ljit-react-components';
import { connect } from 'ljit-store-connecter';
import Body from './content';
import Comments from './comments';
import ActionButtons from './action-buttons';
import DefaultScreen from '../../../components/default-screen';
import CommentSubmitForm from './comments/comment-submit-form';
import {
	commentsActions,
	orderActions,
	fileActions,
} from '../../../controller';
import {
	ClientDepartmentTypeEnums,
	LoadingStatusEnum,
	OrderTypeEnums,
} from '../../../lib/enums';
import {
	MePropTypes,
	OrderPropTypes,
	ChannelPropTypes,
	CommentPropTypes,
} from '../../../lib/prop-types-utils';
import { OrderListSvg } from '../../../images';
import {
	checkHasActions,
	checkIsOrderClosed,
	checkIsShowButtons,
	checkIsMatcher,
} from '../utils';
import './styles.styl';

const { uploadFileAction } = fileActions;
const {
	fetchOrderAction,
	resetSelectedOrderIdAction,
	updateHadReadOrderAction,
	updateOrderNumberAction,
} = orderActions;
const {
	fetchCommentsAction,
	createCommentAction,
	resetCommentsAction,
} = commentsActions;
const {
	PROVIDER,
	CONSUMER,
	OWNER,
} = ClientDepartmentTypeEnums;
const {
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	PROCESSING,
	TRACKED,
	CLOSED,
} = OrderTypeEnums;
const {
	Header,
	Content,
} = Layout;
const propTypes = {
	meData: MePropTypes.isRequired,
	selectedOrderId: PropTypes.string,
	selectedChannel: ChannelPropTypes,
	orderData: OrderPropTypes.isRequired,
	commentsData: PropTypes.arrayOf(CommentPropTypes).isRequired,
	departmentType: PropTypes.oneOf([PROVIDER, CONSUMER, OWNER]),
	fetchOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	createCommentLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	uploadFileLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	fetchCommentsLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	resolveOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)).isRequired,
	fetchOrderAction: PropTypes.func.isRequired,
	fetchCommentsAction: PropTypes.func.isRequired,
	createCommentAction: PropTypes.func.isRequired,
	resetCommentsAction: PropTypes.func.isRequired,
	uploadFileAction: PropTypes.func.isRequired,
	resetSelectedOrderIdAction: PropTypes.func.isRequired,
	updateHadReadOrderAction: PropTypes.func.isRequired,
	updateOrderNumberAction: PropTypes.func.isRequired,
	providerSelectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
	consumerSelectedTab: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED, '']),
};
const PREFIX_CLASS = 'order-detail-page';

class OrderDetail extends Component {
	constructor() {
		super();

		this._handleFetchOrder = this._handleFetchOrder.bind(this);
		this._handleEditOrderNumber = this._handleEditOrderNumber.bind(this);
		this._handleUploadFile = this._handleUploadFile.bind(this);
		this._handleSubmitComment = this._handleSubmitComment.bind(this);
		this._handleFetchComments = this._handleFetchComments.bind(this);
		this._renderActionButtons = this._renderActionButtons.bind(this);
		this._renderOrderDetailContent = this._renderOrderDetailContent.bind(this);
		this._renderFooter = this._renderFooter.bind(this);
	}

	_handleFetchOrder() {
		const {
			selectedOrderId,
			fetchOrderAction,
		} = this.props;

		fetchOrderAction(selectedOrderId);
	}

	_handleEditOrderNumber(orderId, orderNumber) {
		const { updateOrderNumberAction } = this.props;

		updateOrderNumberAction(orderId, orderNumber);
	}

	_handleUploadFile(file) {
		const { selectedChannel = {}, selectedOrderId, uploadFileAction } = this.props;

		uploadFileAction(selectedChannel.id, selectedOrderId, file);
	}

	_handleFetchComments() {
		const { selectedChannel = {}, selectedOrderId, fetchCommentsAction } = this.props;

		fetchCommentsAction(selectedChannel.id, selectedOrderId);
	}

	_handleSubmitComment(content) {
		const { selectedChannel = {}, selectedOrderId, createCommentAction } = this.props;

		createCommentAction(selectedChannel.id, selectedOrderId, content);
	}

	_renderActionButtons() {
		const {
			selectedOrderId,
			departmentType,
			orderData,
			meData,
		} = this.props;
		const { handler } = orderData;
		const hasActions = checkHasActions(departmentType, orderData, meData.id);
		const isShowButtons = checkIsShowButtons(selectedOrderId, hasActions, handler);

		if (isShowButtons) {
			return (
				<div className={`${PREFIX_CLASS}__action-buttons`}>
					<ActionButtons/>
				</div>
			);
		}
	}

	_renderFooter() {
		const { departmentType, orderData, meData, selectedOrderId } = this.props;
		const { status } = orderData;
		const isMatcher = checkIsMatcher(departmentType, orderData, meData.id);
		const isOrderClosed = checkIsOrderClosed(status);

		if (!isOrderClosed && selectedOrderId) {
			return (
				<CommentSubmitForm
					onSubmitComment={this._handleSubmitComment}
					isDisabled={!isMatcher}
				/>
			);
		}

		return null;
	}

	_renderOrderDetailContent() {
		const { _handleSubmitComment, _handleUploadFile, _handleEditOrderNumber, props } = this;
		const {
			meData,
			departmentType,
			orderData,
			selectedOrderId,
			commentsData,
			fetchOrderLoadingStatus,
			uploadFileLoadingStatus,
			providerSelectedTab,
			consumerSelectedTab,
		} = props;
		const hasActions = checkHasActions(departmentType, orderData, meData.id);
		const isFileLoading = uploadFileLoadingStatus === LOADING ||
		fetchOrderLoadingStatus === LOADING;
		const hasEditIcon = consumerSelectedTab !== CLOSED && providerSelectedTab !== CLOSED;

		if (selectedOrderId) {
			return (
				<>
					<Body
						orderData={orderData}
						isFileLoading={isFileLoading}
						onEditOrderNumber={_handleEditOrderNumber}
						onUploadFile={_handleUploadFile}
						hasActions={hasActions}
						hasEditIcon={hasEditIcon}
					/>
					<Comments
						onSubmitComment={_handleSubmitComment}
						commentsData={commentsData}
					/>
				</>
			);
		}

		return <DefaultScreen message="请点选左边派单开始处理"/>;
	}

	render() {
		const {
			_renderActionButtons,
			_renderOrderDetailContent,
			_renderFooter,
		} = this;

		return (
			<>
				<div className={`layout__wrap ${PREFIX_CLASS}`}>
					<Header className={`layout__header ${PREFIX_CLASS}__header`}>
						<div className={`layout__header__title ${PREFIX_CLASS}__title`}>
							<img src={OrderListSvg}/>
							派单资讯
						</div>
						{_renderActionButtons()}
					</Header>
					<Content className="layout__content">
						{_renderOrderDetailContent()}
					</Content>
				</div>
				<div className={cx(PREFIX_CLASS, `${PREFIX_CLASS}-footer`)}>
					<div className={`${PREFIX_CLASS}__form`}>
						{_renderFooter()}
					</div>
				</div>
			</>
		);
	}

	componentDidUpdate(prevProps) {
		const { _handleFetchComments, _handleFetchOrder, props } = this;
		const {
			selectedChannel = {},
			selectedOrderId,
			fetchOrderLoadingStatus,
			resetSelectedOrderIdAction,
			resetCommentsAction,
			fetchCommentsLoadingStatus,
			resolveOrderLoadingStatus,
			updateHadReadOrderAction,
			orderData,
		} = props;
		const { hasNewActivity, status } = orderData;
		const isCommentsLoadingSuccess = prevProps.fetchCommentsLoadingStatus === LOADING &&
		fetchCommentsLoadingStatus === SUCCESS;
		const isResolveSuccess = prevProps.resolveOrderLoadingStatus === LOADING &&
		resolveOrderLoadingStatus === SUCCESS;
		const isOrderClosed = checkIsOrderClosed(status);

		if (selectedOrderId) {
			if ((prevProps.selectedOrderId !== selectedOrderId) || isResolveSuccess) {
				_handleFetchOrder();
			}

			if (prevProps.fetchOrderLoadingStatus === LOADING) {
				if (fetchOrderLoadingStatus === SUCCESS) {
					_handleFetchComments();
				}

				if (fetchOrderLoadingStatus === FAILED) {
					resetSelectedOrderIdAction();
					resetCommentsAction();
				}
			}

			if (isCommentsLoadingSuccess && hasNewActivity && !isOrderClosed) {
				updateHadReadOrderAction(selectedChannel.id, selectedOrderId);
			}
		}
	}
}

OrderDetail.propTypes = propTypes;

function mapStateToProps(state) {
	const orderReducer = state.order;

	return {
		meData: state.auth.get('me').toObject(),
		departmentType: state.auth.get('departmentType'),
		selectedChannel: state.channel.get('data').toObject(),
		commentsData: state.comment.get('data').toArray(),
		fetchCommentsLoadingStatus: state.comment.get('loadingStatus'),
		createCommentLoadingStatus: state.comment.get('createCommentLoadingStatus'),
		uploadFileLoadingStatus: state.file.get('loadingStatus'),
		orderData: orderReducer.get('data').toObject(),
		selectedOrderId: orderReducer.get('selectedOrderId'),
		fetchOrderLoadingStatus: orderReducer.get('fetchOrderLoadingStatus'),
		resolveOrderLoadingStatus: orderReducer.get('resolveOrderLoadingStatus'),
		providerSelectedTab: state.orders.get('selectedTab'),
		consumerSelectedTab: state.consumerOrders.get('selectedTab'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchOrderAction: (...args) => dispatch(fetchOrderAction(...args)),
		resetSelectedOrderIdAction: () => dispatch(resetSelectedOrderIdAction()),
		fetchCommentsAction: (...args) => dispatch(fetchCommentsAction(...args)),
		createCommentAction: (...args) => dispatch(createCommentAction(...args)),
		resetCommentsAction: () => dispatch(resetCommentsAction()),
		uploadFileAction: (...args) => dispatch(uploadFileAction(...args)),
		updateHadReadOrderAction: (...args) => dispatch(updateHadReadOrderAction(...args)),
		updateOrderNumberAction: (...args) => dispatch(updateOrderNumberAction(...args)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
