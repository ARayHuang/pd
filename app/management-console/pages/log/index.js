import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import PageBlock from '../../components/page-block';
import {
	Form,
	FormItem,
	Input,
	DateRangePicker,
	Table,
	TextButton,
	Modal,
	Timeline,
	Tooltip,
} from 'ljit-react-components';
import { Tag as AntdTag } from 'antd';
import OrderDetail from '../../components/order-detail';
import { getTableQuery } from '../../lib/table-utils';
import {
	OrderStatusDisplayNameEnums,
	LoadingStatusEnum,
} from '../../../lib/enums';
import { LogTypeEnums } from '../../lib/enums';
import {
	formatDate,
	convertStartOfDayToDateTimeString,
	convertEndOfDayToDateTimeString,
} from '../../../lib/moment-utils';
import { connect } from 'ljit-store-connecter';
import {
	orderActions,
	orderCommentActions,
	orderLogActions,
} from '../../controller';
import {
	OrdersPropTypes,
	OrderPropTypes,
	LogsPropTypes,
	OrderCommentsPropTypes,
	ChannelsPropTypes,
} from '../../lib/prop-types-utils';
import { orderNumberValidator } from '../../../lib/validator-utils';
import './style.styl';

const TimelineItem = Timeline.Item;
const PREFIX_CLASS = 'log-page';
const DEFAULT_PAGE = 1;
const { CREATED, ACCEPTED, RESOLVED, TRACKED, COMPLETED, DELETED, TRANSFERED, INVITED, UPDATED_ORDER_DESCRIPTION } = LogTypeEnums;
const TypeTextMap = {
	[CREATED]: '已建立单子',
	[ACCEPTED]: '已接下案子',
	[RESOLVED]: '已完成案子',
	[TRACKED]: '追踪',
	[COMPLETED]: '结单',
	[DELETED]: '已删除单子',
};
const { fetchOrdersAction } = orderActions;
const { fetchOrderAction, fetchOrderCommentsAction } = orderCommentActions;
const { fetchOrderLogsAction } = orderLogActions;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const propTypes = {
	ordersData: OrdersPropTypes,
	numOfItems: PropTypes.number,
	page: PropTypes.number,
	orderData: OrderPropTypes,
	orderCommentsData: OrderCommentsPropTypes,
	orderLogsData: LogsPropTypes,
	channelsData: PropTypes.arrayOf(ChannelsPropTypes),
	loadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	fetchOrdersAction: PropTypes.func.isRequired,
	fetchOrderAction: PropTypes.func.isRequired,
	fetchOrderCommentsAction: PropTypes.func.isRequired,
	fetchOrderLogsAction: PropTypes.func.isRequired,
};

function LogPage({
	ordersData,
	numOfItems,
	page,
	orderData,
	orderCommentsData,
	orderLogsData,
	loadingStatus,
	fetchOrdersAction,
	fetchOrderAction,
	fetchOrderCommentsAction,
	fetchOrderLogsAction,
}) {
	let formRef = useRef(null);
	const [queryParameters, setQueryParameters] = useState({});
	const [isLogVisible, setIsLogVisible] = useState(false);
	const [isDetailVisible, setIsDetailVisible] = useState(false);

	useEffect(() => {
		fetchOrdersAction(queryParameters);
	}, []);

	function _handleSearch() {
		const form = formRef.current.getForm();

		form.validateFields((error, values) => {
			if (!error) {
				const {
					description,
					customerName,
					channelName,
					createdAt = [],
				} = values;
				const [from, to] = createdAt;
				const nextQueryParameters = {
					...queryParameters,
					page: DEFAULT_PAGE,
					description,
					customerName,
					channelName,
					from: from ? convertStartOfDayToDateTimeString(from) : null,
					to: to ? convertEndOfDayToDateTimeString(to) : null,
				};

				setQueryParameters(nextQueryParameters);
				fetchOrdersAction(nextQueryParameters);
			}
		});
	}

	function _renderOrderNumber(orderNumber) {
		if (orderNumber.length > 13) {
			const ellipsisText = orderNumber.slice(0, 13) + '...';

			return (
				<Tooltip
					overlayClassName={`${PREFIX_CLASS}__tooltip-overlay`}
					title={orderNumber}
					isArrowPointAtCenter={true}
				>
					<div><span>{ellipsisText}</span></div>
				</Tooltip>
			);
		}

		return <div><span>{orderNumber}</span></div>;
	}

	function _handleReset() {
		const form = formRef.current.getForm();

		form.resetFields();
	}

	function _handleChangeTable(pagination, filters, sorter) {
		const tableQuery = getTableQuery({ queries: queryParameters, pagination, filters, sorter });
		const { query } = tableQuery;

		setQueryParameters(query);
		fetchOrdersAction(query);
	}

	function _renderTag(tags) {
		const tag = tags[0];
		const { name, backgroundColor, fontColor } = tag;

		return (
			<AntdTag
				color={`#${backgroundColor}`}
				style={{ color: `#${fontColor}` }}
			>
				{name}
			</AntdTag>
		);
	}

	function _renderOperationLogButton(record) {
		return (
			<TextButton
				text="操作纪录"
				onClick={() => {
					setIsLogVisible(true);
					fetchOrderLogsAction(record.id);
				}}
			/>
		);
	}

	function _renderDetailButton(record) {
		return (
			<TextButton
				text="详细"
				onClick={() => {
					setIsDetailVisible(true);
					fetchOrderAction(record.id);
					fetchOrderCommentsAction(record.id);
				}}
			/>
		);
	}

	function _renderTimelineItems() {
		const timeLineItems = orderLogsData.map(data => {
			const { id, operator, type, createdAt, associateUser = {}, orderDescription } = data;
			const { displayName: associateUserName } = associateUser;
			const { displayName: operatorName } = operator;
			let actionText = '';

			switch (type) {
				case TRANSFERED:
					actionText = `轉接給 ${associateUserName}`;
					break;
				case INVITED:
					actionText = `邀请 ${associateUserName} 协作`;
					break;
				case UPDATED_ORDER_DESCRIPTION:
					actionText = `修改订单号为 ${orderDescription}`;
					break;
				default:
					actionText = TypeTextMap[type];
					break;
			}

			return (
				<TimelineItem key={id}>
					<div>
						{`${formatDate(createdAt)} ${operatorName} ${actionText}`}
					</div>
				</TimelineItem>
			);
		});

		return timeLineItems;
	}

	return (
		<PageBlock className={PREFIX_CLASS}>
			<Form
				ref={formRef}
				onSubmit={_handleSearch}
				onCancel={_handleReset}
				submitText="查询"
				cancelText="重置"
			>
				<FormItem
					label="订单号"
					itemName="description" // 由於規格修改，订单号欄位為 "description"
					itemConfig={{
						rules: [{ validator: orderNumberValidator() }],
					}}
				>
					<Input placeholder="请输入订单号"/>
				</FormItem>
				<FormItem
					label="成员"
					itemName="customerName"
				>
					<Input placeholder="请输入成员"/>
				</FormItem>
				<FormItem
					label="开单时间"
					itemName="createdAt"
				>
					<DateRangePicker/>
				</FormItem>
				<FormItem
					label="頻道"
					itemName="channelName"
				>
					<Input placeholder="请输入频道"/>
				</FormItem>
			</Form>
			<Table
				dataSource={ordersData}
				size={Table.TableSizeEnums.LARGE}
				rowKey="id"
				columns={[
					{
						title: '订单号',
						dataIndex: 'description', // 由於規格修改，订单号欄位為 "description"
						render: _renderOrderNumber,
					},
					{
						title: '频道',
						dataIndex: 'channel',
						render: channel => channel.name,
					},
					{
						title: '成员',
						dataIndex: 'customerName',
						className: `${PREFIX_CLASS}__ellipsis`,
					},
					{
						title: '状态',
						dataIndex: 'status',
						render: status => OrderStatusDisplayNameEnums[status],
					},
					{
						title: '开单人员',
						dataIndex: 'owner',
						render: owner => owner.displayName,
					},
					{
						title: '接单人员',
						dataIndex: 'handler',
						render: handler => handler ? handler.displayName : null,
					},
					{
						title: '开单原因',
						dataIndex: 'tags',
						render: _renderTag,
					},
					{
						title: '开单时间',
						dataIndex: 'createdAt',
						sorter: () => {},
						render: createdAt => formatDate(createdAt),
					},
					{
						title: 'Log纪录',
						dataIndex: '',
						render: _renderOperationLogButton,
					},
					{
						title: '派单资讯',
						dataIndex: '',
						render: _renderDetailButton,
					},
				]}
				hasPagination
				paginationProps={{
					showQuickJumper: false,
					showSizeChanger: false,
					totalRenderer: () => {},
					total: numOfItems,
					current: page,
				}}
				isLoading={loadingStatus === LOADING}
				onTableChange={_handleChangeTable}
			/>
			<Modal
				className="order-log-modal"
				visible={isLogVisible}
				onClickCancel={() => setIsLogVisible(false)}
				title="操作纪录"
				cancelText="关闭"
			>
				<Timeline mode={Timeline.ModeEnums.LEFT}>
					{_renderTimelineItems()}
				</Timeline>
			</Modal>
			<Modal
				className="order-info-modal"
				visible={isDetailVisible}
				onClickCancel={() => setIsDetailVisible(false)}
				title="派单资讯"
				cancelText="关闭"
			>
				<OrderDetail orderData={orderData} commentsData={orderCommentsData}/>
			</Modal>
		</PageBlock>
	);
}

function mapStateToProps(state) {
	const orderReducer = state.orders;
	const orderCommentReducer = state.orderComments;
	const logsReducer = state.orderLogs;

	return {
		ordersData: orderReducer.getIn(['data', 'orders']).toArray(),
		numOfItems: orderReducer.getIn(['data', 'numOfItems']),
		page: orderReducer.getIn(['data', 'page']),
		orderData: orderCommentReducer.getIn(['data', 'order']).toObject(),
		orderCommentsData: orderCommentReducer.getIn(['data', 'comments']).toArray(),
		orderLogsData: logsReducer.getIn(['data', 'logs']).toArray(),
		loadingStatus: orderReducer.get('loadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchOrdersAction: queries => dispatch(fetchOrdersAction(queries)),
		fetchOrderAction: orderId => dispatch(fetchOrderAction(orderId)),
		fetchOrderCommentsAction: (orderId, queries) => dispatch(fetchOrderCommentsAction(orderId, queries)),
		fetchOrderLogsAction: (orderId, queries) => dispatch(fetchOrderLogsAction(orderId, queries)),
	};
}

LogPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(LogPage);
