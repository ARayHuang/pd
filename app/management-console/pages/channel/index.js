import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	HeaderButtonBar,
	Button,
	Table,
	TextButton,
	Divider,
	Modal,
} from 'ljit-react-components';
import SubmitFormModal from './submit-form-modal';
import { channelActions } from '../../controller';
import { connect } from 'ljit-store-connecter';
import { LoadingStatusEnum } from '../../../lib/enums';
import { usePrevious } from '../../../lib/react-utils';
import { getTableQuery } from '../../lib/table-utils';
import './style.styl';

const PREFIX_CLASS = 'channel-page';
const { VERTICAL } = Divider.DirectionTypeEnums;
const {
	fetchChannelsAction,
	createChannelAction,
	updateChannelAction,
	deleteChannelAction,
} = channelActions;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const propTypes = {
	channelData: PropTypes.shape({
		channels: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string,
			name: PropTypes.string,
		})),
		page: PropTypes.number,
		numOfItems: PropTypes.number,
		numOfPages: PropTypes.number,
	}),
	fetchChannelsAction: PropTypes.func.isRequired,
	createChannelAction: PropTypes.func.isRequired,
	updateChannelAction: PropTypes.func.isRequired,
	deleteChannelAction: PropTypes.func.isRequired,
	createChannelLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	updateChannelLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	deleteChannelLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
};

function ChannelPage({
	channelData = {},
	fetchChannelsAction,
	createChannelAction,
	updateChannelAction,
	deleteChannelAction,
	createChannelLoadingStatus,
	updateChannelLoadingStatus,
	deleteChannelLoadingStatus,
}) {
	const [queryParameters, setQueryParameters] = useState({});
	const [isCreate, setIsCreate] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState({});
	const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const prevCreateChannelLoadingStatus = usePrevious(createChannelLoadingStatus);
	const prevUpdateChannelLoadingStatus = usePrevious(updateChannelLoadingStatus);
	const prevDeleteChannelLoadingStatus = usePrevious(deleteChannelLoadingStatus);
	const columns = [
		{
			dataIndex: 'name',
			title: '频道',
		},
		{
			dataIndex: '',
			title: '操作',
			render: _renderActions,
		},
	];

	useEffect(() => {
		fetchChannelsAction(queryParameters);
	}, []);

	useEffect(() => {
		if (prevCreateChannelLoadingStatus === LOADING &&
			createChannelLoadingStatus === SUCCESS) {
			fetchChannelsAction(queryParameters);
		}
	}, [createChannelLoadingStatus]);

	useEffect(() => {
		if (prevUpdateChannelLoadingStatus === LOADING &&
			updateChannelLoadingStatus === SUCCESS) {
			fetchChannelsAction(queryParameters);
		}
	}, [updateChannelLoadingStatus]);

	useEffect(() => {
		if (prevDeleteChannelLoadingStatus === LOADING &&
			deleteChannelLoadingStatus === SUCCESS) {
			fetchChannelsAction(queryParameters);
		}
	}, [deleteChannelLoadingStatus]);

	function _handleCreateChannel(values) {
		const { name } = values;

		createChannelAction(name);
	}

	function _handleUpdateChannel(values) {
		const { name } = values;
		const { id } = selectedChannel;

		updateChannelAction(id, name);
	}

	function _handleSubmit(values) {
		if (isCreate) {
			_handleCreateChannel(values);
		} else {
			_handleUpdateChannel(values);
		}

		setIsSubmitModalVisible(false);
	}

	function _handleShowSubmitModal(isCreate, _selectedChannel = {}) {
		setSelectedChannel(_selectedChannel);
		setIsCreate(isCreate);
		setIsSubmitModalVisible(true);
	}

	function _handleShowDeleteModal(_selectedChannel = {}) {
		setSelectedChannel(_selectedChannel);
		setIsDeleteModalVisible(true);
	}

	function _handleDeleteChannel() {
		const { id } = selectedChannel;

		deleteChannelAction(id);
		setIsDeleteModalVisible(false);
	}

	function _handleChangeTable(pagination, filters, sorter) {
		const tableQuery = getTableQuery({ queries: queryParameters, pagination, filters, sorter });
		const { query } = tableQuery;

		setQueryParameters(query);
		fetchChannelsAction(query);
	}

	function _renderActions(data) {
		return (
			<div style={{ whiteSpace: 'nowrap' }}>
				<TextButton
					color="danger"
					text="删除"
					onClick={() => _handleShowDeleteModal(data)}
				/>
				<Divider type={VERTICAL}/>
				<TextButton
					text="修改"
					onClick={() => _handleShowSubmitModal(false, data)}
				/>
			</div>
		);
	}

	return (
		<div className={PREFIX_CLASS}>
			<HeaderButtonBar
				right={(
					<Button
						icon="plus"
						onClick={() => _handleShowSubmitModal(true)}
						color={Button.ColorEnums.BRIGHTBLUE500}
					>
						新增频道
					</Button>
				)}
			/>
			<Table
				rowKey="id"
				className={`${PREFIX_CLASS}__channel-list`}
				columns={columns}
				dataSource={channelData.channels}
				hasPagination
				paginationProps={{
					showQuickJumper: false,
					showSizeChanger: false,
					total: channelData.numOfItems,
					current: channelData.page,
				}}
				onTableChange={_handleChangeTable}
			/>
			<SubmitFormModal
				className={`${PREFIX_CLASS}__submit-form-modal`}
				title={isCreate ? '新增频道' : '修改频道'}
				isVisible={isSubmitModalVisible}
				onClickOk={_handleSubmit}
				onClickCancel={() => setIsSubmitModalVisible(false)}
				initialValue={selectedChannel}
			/>
			<Modal.Message
				title="通知"
				message="确定删除此频道？"
				onClickCancel={() => setIsDeleteModalVisible(false) }
				onClickOk={_handleDeleteChannel}
				visible={isDeleteModalVisible}
			/>
		</div>
	);
}

function mapStateToProps(state) {
	const data = state.channels.get('data').toObject();

	return {
		channelData: {
			channels: data.channels.toArray(),
			numOfItems: data.numOfItems,
			numOfPages: data.numOfPages,
			page: data.page,
		},
		createChannelLoadingStatus: state.channels.get('createChannelLoadingStatus'),
		updateChannelLoadingStatus: state.channels.get('updateChannelLoadingStatus'),
		deleteChannelLoadingStatus: state.channels.get('deleteChannelLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchChannelsAction: (...args) => dispatch(fetchChannelsAction(...args)),
		createChannelAction: (...args) => dispatch(createChannelAction(...args)),
		updateChannelAction: (...args) => dispatch(updateChannelAction(...args)),
		deleteChannelAction: (...args) => dispatch(deleteChannelAction(...args)),
	};
}

ChannelPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ChannelPage);
