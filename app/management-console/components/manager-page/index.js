import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import {
	Table,
	TextButton,
	Divider,
	Form,
	FormItem,
	Input,
	Select,
	Button,
	HeaderButtonBar,
	Row,
	Col,
	UserAvatar,
	Modal,
	StatusTag,
} from 'ljit-react-components';
import {
	DepartmentTypeEnums,
	DepartmentTypeDisplayNameEnums,
	ShiftTypeDisplayNameEnums,
	ShiftTypeEnums,
	StatusTagEnums,
} from '../../lib/enums';
import { UserImagesMap } from '../../../images';
import { UserPropTypes, ChannelOptionsPropTypes } from '../../lib/prop-types-utils';
import SubmitFormModal from '../submit-form-modal';
import { getTableQuery } from '../../lib/table-utils';
import { checkRoleRules } from '../../../lib/role-rules-utils';
import { rules, RuleEnums } from '../../configs/role-access-config';
import './style.styl';

const PREFIX_CLASS = 'manager-page';
const { VERTICAL } = Divider.DirectionTypeEnums;
const { MEDIUM } = FormItem.ColumnTypeEnums;
const { PLUS } = Button.IconEnums;
const { PROVIDER, CONSUMER } = DepartmentTypeEnums;
const { MORNING, NOON, NIGHT } = ShiftTypeEnums;
const { PERMISSION_TO_ADD_STAFF } = RuleEnums;
const AVATAR_SIZE = 39;
const COL_SPAN = 8;
const propTypes = {
	className: PropTypes.string,
	me: UserPropTypes,
	users: PropTypes.arrayOf(UserPropTypes),
	departmentType: PropTypes.oneOf([PROVIDER, CONSUMER]),
	channelOptions: ChannelOptionsPropTypes,
	pagination: PropTypes.shape({
		numOfItems: PropTypes.number,
		page: PropTypes.number,
	}),
	onSearch: PropTypes.func,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
	onDelete: PropTypes.func,
};
const defaultProps = {
	departmentType: PROVIDER,
	channelOptions: [],
	onSearch: () => {},
	onCreate: () => {},
	onUpdate: () => {},
	onDelete: () => {},
};

function ManagerPage({
	className,
	me,
	users,
	departmentType,
	channelOptions,
	onSearch,
	onCreate,
	onUpdate,
	onDelete,
	pagination,
}) {
	const formInstance = useRef(null);
	const [userInfo, setUserInfo] = useState({});
	const [queries, setQueries] = useState({ page: 1 });
	const [isCreateAccount, setIsCreateAccount] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
	const {
		numOfItems,
		page,
	} = pagination;
	const { type, hasPermissionToAddStaff } = me;
	const hasPermission = checkRoleRules(rules, type, PERMISSION_TO_ADD_STAFF, hasPermissionToAddStaff);
	const columns = [
		{
			dataIndex: 'profilePictureId',
			title: '头像',
			render: _renderTableProfilePicture,
		},
		{
			dataIndex: 'username',
			title: '帐号',
		},
		{
			dataIndex: 'displayName',
			title: '显示名称',
		},
		{
			dataIndex: 'channels',
			title: '频道',
			render: channels => {
				let output = '';

				channels.forEach(({ name }, index) => {
					if (index) {
						output += `/${name}`;
					} else {
						output += `${name}`;
					}
				});
				return output;
			},
		},
		{
			dataIndex: 'departmentType',
			title: '组别',
			render: departmentType => DepartmentTypeDisplayNameEnums[departmentType],
		},
		{
			dataIndex: 'shiftType',
			title: '班别',
			render: shiftType => ShiftTypeDisplayNameEnums[shiftType],
		},
		{
			dataIndex: 'isOnline',
			title: '状态',
			render: _renderStatusTag,
		},
		{
			dataIndex: '',
			title: '操作',
			render: _renderTableModify,
		},
	];

	function _renderTableProfilePicture(profilePictureId) {
		return (
			<UserAvatar
				size={AVATAR_SIZE}
				src={UserImagesMap[profilePictureId]}
				alignment={UserAvatar.AlignmentEnums.TOP}
				style={{ width: '100%' }}
			/>
		);
	}

	function _renderTableModify(data) {
		return (
			<div style={{ whiteSpace: 'nowrap' }}>
				<TextButton
					color="danger"
					text="删除"
					onClick={() => _handleDeleteAccount(data)}
				/>
				<Divider type={VERTICAL}/>
				<TextButton
					text="修改"
					onClick={() => _handleModifyAccount(data)}
				/>
			</div>
		);
	}

	function _handleClickMessageModalOk() {
		const {
			id,
		} = userInfo;

		onDelete(id);
		setIsMessageModalVisible(false);
	}

	function _handleClickMessageModalCancel() {
		setIsMessageModalVisible(false);
	}

	function _handleChangeTablePage(pagination, filters, sorter) {
		const tableQuery = getTableQuery({ queries, pagination, filters, sorter });
		const { query } = tableQuery;

		setQueries(query);
		onSearch(query);
	}

	function _handleDeleteAccount(userInfo) {
		setUserInfo(userInfo);
		setIsMessageModalVisible(true);
	}

	function _handleModifyAccount(userInfo) {
		const { channels = [] } = userInfo;
		const nextChannels = channels.map(channel => channel.id);

		setUserInfo({
			...userInfo,
			channels: nextChannels,
		});
		setIsCreateAccount(false);
		setIsModalVisible(true);
	}

	function _handleAddAccount() {
		setUserInfo({ departmentType });
		setIsCreateAccount(true);
		setIsModalVisible(true);
	}

	function _handleSearchSubmit() {
		const { validateFields } = formInstance.current.getForm();

		validateFields((err, values) => {
			if (!err) {
				const nextQueries = {
					...queries,
					...values,
				};

				onSearch(nextQueries);
				setQueries(nextQueries);
			}
		});
	}

	function _handleSearchCancel() {
		const { resetFields } = formInstance.current.getForm();

		resetFields();
	}

	function _handleFormSubmit(values) {
		if (isCreateAccount) {
			onCreate(values);
		} else {
			let _nextValues = cloneDeep(values);

			if (!_nextValues.password) {
				_nextValues = updatePassword(_nextValues);
			}

			onUpdate({ id: userInfo.id, _nextValues });
		}

		setIsModalVisible(false);
	}

	function _handleFormCancel() {
		setIsModalVisible(false);
	}

	function _renderSearchForm() {
		return (
			<Row>
				<Form
					onSubmit={_handleSearchSubmit}
					onCancel={_handleSearchCancel}
					ref={formInstance}
					submitText="查询"
					cancelText="重置"
				>
					<Col span={COL_SPAN}>
						<FormItem label="帐号" itemName="username" className={`${PREFIX_CLASS}__left`} columnType={MEDIUM}>
							<Input placeholder="请输入帐号"/>
						</FormItem>
					</Col>
					<Col span={COL_SPAN}>
						<FormItem label="显示名称" itemName="displayName" columnType={MEDIUM}>
							<Input placeholder="请输入显示名称"/>
						</FormItem>
					</Col>
					<Col span={COL_SPAN}>
						<FormItem label="频道" itemName="channelName" columnType={MEDIUM}>
							<Input placeholder="请输入频道名称"/>
						</FormItem>
					</Col>
					<Col span={COL_SPAN}>
						<FormItem label="班別" itemName="shiftType" className={`${PREFIX_CLASS}__left`} columnType={MEDIUM}>
							<Select
								placeholder="请选择"
								options={[
									{ label: ShiftTypeDisplayNameEnums[MORNING], value: MORNING },
									{ label: ShiftTypeDisplayNameEnums[NOON], value: NOON },
									{ label: ShiftTypeDisplayNameEnums[NIGHT], value: NIGHT },
								]}
							/>
						</FormItem>
					</Col>
				</Form>
			</Row>
		);
	}

	function _renderStatusTag(status) {
		const statusMap = StatusTagEnums[status];

		if (!statusMap) {
			return '';
		}

		return <StatusTag {...statusMap} />;
	}

	return (
		<div className={cx(PREFIX_CLASS, className)}>
			{_renderSearchForm()}
			{hasPermission && <HeaderButtonBar
				right={(
					<Button
						icon={PLUS}
						onClick={_handleAddAccount}
						color={Button.ColorEnums.BRIGHTBLUE500}
					>
						新增帐号
					</Button>
				)}
			/>}
			<Table
				rowKey="id"
				className={`${PREFIX_CLASS}__account-info`}
				columns={hasPermission ? columns : columns.slice(0, -1)}
				dataSource={users}
				hasPagination
				paginationProps={{
					showQuickJumper: false,
					showSizeChanger: false,
					total: numOfItems,
					current: page,
				}}
				onTableChange={_handleChangeTablePage}
			/>
			<SubmitFormModal
				title={isCreateAccount ? '新增帐号' : '修改帐号'}
				className={`${PREFIX_CLASS}__submit-form-modal`}
				isVisible={isModalVisible}
				initialValue={userInfo}
				isCreateAccount={isCreateAccount}
				onClickCancel={_handleFormCancel}
				onClickOk={_handleFormSubmit}
				channelOptions={channelOptions}
			/>
			<Modal.Message
				title="通知"
				message="确定删除此帐号？"
				onClickCancel={_handleClickMessageModalCancel}
				onClickOk={_handleClickMessageModalOk}
				visible={isMessageModalVisible}
			/>
		</div>
	);
}

ManagerPage.propTypes = propTypes;
ManagerPage.defaultProps = defaultProps;

export default ManagerPage;

function updatePassword(data) {
	return Object.assign(data, {
		password: undefined,
	});
}
