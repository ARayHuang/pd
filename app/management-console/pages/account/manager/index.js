import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { connect } from 'ljit-store-connecter';
import {
	DepartmentTypeEnums,
	DepartmentTypeDisplayNameEnums,
	UserTypeEnums,
} from '../../../lib/enums';
import { CheckSvg, NoSvg } from '../../../images';
import { UsersPropTypes } from '../../../lib/prop-types-utils';
import { userActions } from '../../../controller';
import SubmitFormModal from './submit-form-modal';
import {
	LoadingStatusEnum,
	StatusTagEnums,
} from '../../../lib/enums';
import { UserImagesMap } from '../../../../images';
import { usePrevious } from '../../../../lib/react-utils';
import { getTableQuery } from '../../../lib/table-utils';
import './style.styl';

const PREFIX_CLASS = 'account-manager-page';
const FORM_ITEM_CLASS = 'search-form-item';
const { PROVIDER, CONSUMER } = DepartmentTypeEnums;
const { VERTICAL } = Divider.DirectionTypeEnums;
const {
	fetchUsersAction,
	createManagerAction,
	updateManagerAction,
	deleteUserAction,
} = userActions;
const AVATAR_SIZE = 39;
const LEFT_COL_SPAN = 8;
const MID_COL_SPAN = 8;
const RIGHT_COL_SPAN = 8;
const { MANAGER } = UserTypeEnums;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const queries = {
	userType: MANAGER,
	departmentType: undefined,
};
const propTypes = {
	usersData: UsersPropTypes.isRequired,
	fetchUsersAction: PropTypes.func.isRequired,
	createManagerAction: PropTypes.func.isRequired,
	updateManagerAction: PropTypes.func.isRequired,
	deleteUserAction: PropTypes.func.isRequired,
	createManagerLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	updateManagerLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	deleteUserLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
};

function AccountManagerPage({
	usersData,
	fetchUsersAction,
	createManagerAction,
	updateManagerAction,
	deleteUserAction,
	createManagerLoadingStatus,
	updateManagerLoadingStatus,
	deleteUserLoadingStatus,
}) {
	const formInstance = useRef(null);
	const [userInfo, setUserInfo] = useState({});
	const [isCreateAccount, setIsCreateAccount] = useState(false);
	const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
	const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
	const [queries, setQueries] = useState({ page: 1 });
	const prevCreateManagerLoadingStatus = usePrevious(createManagerLoadingStatus);
	const prevUpdateManagerLoadingStatus = usePrevious(updateManagerLoadingStatus);
	const prevDeleteUserLoadingStatus = usePrevious(deleteUserLoadingStatus);
	const {
		users,
		numOfItems,
		page,
	} = usersData;
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
			dataIndex: 'departmentType',
			title: '组别',
			render: departmentType => DepartmentTypeDisplayNameEnums[departmentType],
		},
		{
			dataIndex: 'isOnline',
			title: '状态',
			render: _renderStatusTag,
		},
		{
			dataIndex: 'hasPermissionToAddStaff',
			title: '新增部門人員帳號',
			render: _renderPermission,
		},
		{
			dataIndex: '',
			title: '操作',
			render: _renderTableModify,
		},
	];

	useEffect(() => {
		fetchUsersAction();
	}, []);

	useEffect(() => {
		if (prevCreateManagerLoadingStatus === LOADING &&
			createManagerLoadingStatus === SUCCESS) {
			const { departmentType, currentQueries } = queries;

			fetchUsersAction(departmentType, currentQueries);
		}
	}, [createManagerLoadingStatus]);

	useEffect(() => {
		if (prevUpdateManagerLoadingStatus === LOADING &&
			updateManagerLoadingStatus === SUCCESS) {
			const { departmentType, currentQueries } = queries;

			fetchUsersAction(departmentType, currentQueries);
		}
	}, [updateManagerLoadingStatus]);

	useEffect(() => {
		if (prevDeleteUserLoadingStatus === LOADING &&
			deleteUserLoadingStatus === SUCCESS) {
			const { departmentType, currentQueries } = queries;

			fetchUsersAction(departmentType, currentQueries);
		}
	}, [deleteUserLoadingStatus]);

	function _handleChangeTablePage(pagination, filters, sorter) {
		const { departmentType, currentQueries } = queries;
		const tableQuery = getTableQuery({ currentQueries, pagination, filters, sorter });
		const { query } = tableQuery;

		setQueries(query);
		fetchUsersAction(departmentType, query);
	}

	function _handleClickDelete(userInfo) {
		setUserInfo(userInfo);
		setIsMessageModalVisible(true);
	}

	function _handleClickModify(userInfo) {
		setUserInfo(userInfo);
		setIsCreateAccount(false);
		setIsSubmitModalVisible(true);
	}

	function _handleAddAccount() {
		setUserInfo({});
		setIsCreateAccount(true);
		setIsSubmitModalVisible(true);
	}

	function _handleFormSubmitClick() {
		const { validateFields } = formInstance.current.getForm();

		validateFields((err, values) => {
			if (!err) {
				const { userType, ...prevQueries } = queries;
				const { departmentType, ...filters } = values;
				const nextQuery = {
					...prevQueries,
					...filters,
				};

				fetchUsersAction(departmentType, nextQuery);
				setQueries(nextQuery);
			}
		});
	}

	function _handleFormCancelClick() {
		const { resetFields } = formInstance.current.getForm();

		resetFields();
	}

	function _handleCreateManager(values) {
		const {
			departmentType,
			displayName,
			password,
			profilePictureId,
			username,
			hasPermissionToAddStaff,
		} = values;

		createManagerAction({
			departmentType,
			displayName,
			password,
			profilePictureId,
			username,
			hasPermissionToAddStaff,
		});
	}

	function _handleUpdateManager(values) {
		const {
			profilePictureId,
			displayName,
			password,
			hasPermissionToAddStaff,
		} = values;
		const { id } = userInfo;

		updateManagerAction(id, {
			profilePictureId,
			displayName,
			password,
			hasPermissionToAddStaff,
		});
	}

	function _handleClickModalOk(values) {
		if (isCreateAccount) {
			_handleCreateManager(values);
		} else {
			let _nextValues = cloneDeep(values);

			if (!_nextValues.password) {
				_nextValues = updatePassword(_nextValues);
			}

			_handleUpdateManager(_nextValues);
		}

		setIsSubmitModalVisible(false);
	}

	function _handleClickModelCancel() {
		setIsSubmitModalVisible(false);
	}

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
					onClick={() => _handleClickDelete(data)}
				/>
				<Divider type={VERTICAL}/>
				<TextButton
					text="修改"
					onClick={() => _handleClickModify(data)}
				/>
			</div>
		);
	}

	function _renderStatusTag(status) {
		const statusMap = StatusTagEnums[status];

		if (!statusMap) {
			return '';
		}

		return <StatusTag {...statusMap} />;
	}

	function _renderPermission(hasPermissionToAddStaff) {
		const yes = <div><img src={CheckSvg}/><span> 是</span></div>;
		const no = <div><img src={NoSvg}/><span> 否</span></div>;

		return (<>{hasPermissionToAddStaff ? yes : no}</>);
	}

	function _handleClickMessageModalOk() {
		const { id } = userInfo;

		deleteUserAction(id);
		setIsMessageModalVisible(false);
	}

	function _handleClickMessageModalCancel() {
		setIsMessageModalVisible(false);
	}

	function _renderSearchForm() {
		return (
			<>
				<Row>
					<Form
						onSubmit={_handleFormSubmitClick}
						onCancel={_handleFormCancelClick}
						ref={formInstance}
						submitText="查询"
						cancelText="重置"
					>
						<Row gutter={40}>
							<Col span={LEFT_COL_SPAN}>
								<FormItem className={`${FORM_ITEM_CLASS} ${FORM_ITEM_CLASS}__left`} label="组别" itemName="departmentType">
									<Select
										placeholder="请选择"
										options={[
											{ label: DepartmentTypeDisplayNameEnums[PROVIDER], value: PROVIDER },
											{ label: DepartmentTypeDisplayNameEnums[CONSUMER], value: CONSUMER },
										]}
									/>
								</FormItem>
							</Col>
							<Col span={MID_COL_SPAN}>
								<FormItem className={`${FORM_ITEM_CLASS} ${FORM_ITEM_CLASS}__middle`} label="显示名称" itemName="displayName">
									<Input placeholder="请输入显示名称"/>
								</FormItem>
							</Col>
							<Col span={RIGHT_COL_SPAN}>
								{/* TODO add formal itemName and options */}
								<FormItem className={`${FORM_ITEM_CLASS} ${FORM_ITEM_CLASS}__right`} label="可新增部門人員帳號" itemName="hasPermissionToAddStaff">
									<Select
										placeholder="请选择"
										options={[
											{ label: '全部', value: null },
											{ label: '是', value: 'true' },
											{ label: '否', value: 'false' },
										]}
									/>
								</FormItem>
							</Col>
						</Row>
						<Row gutter={40}>
							<Col span={MID_COL_SPAN}>
								<FormItem className={`${FORM_ITEM_CLASS} ${FORM_ITEM_CLASS}__left`} label="帐号" itemName="username">
									<Input placeholder="请输入帐号"/>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</Row>
			</>
		);
	}

	return (
		<div className={PREFIX_CLASS}>
			{_renderSearchForm()}
			<HeaderButtonBar
				right={(
					<Button
						icon="plus"
						color={Button.ColorEnums.BRIGHTBLUE500}
						onClick={_handleAddAccount}
					>
						新增帐号
					</Button>
				)}
			/>
			<Table
				rowKey="id"
				className={`${PREFIX_CLASS}__account-info`}
				columns={columns}
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
				className={`${PREFIX_CLASS}__submit-form-modal`}
				title={isCreateAccount ? '新增帐号' : '修改帐号'}
				isVisible={isSubmitModalVisible}
				onClickOk={_handleClickModalOk}
				onClickCancel={_handleClickModelCancel}
				isCreateAccount={isCreateAccount}
				initialValue={userInfo}
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

AccountManagerPage.propTypes = propTypes;

function mapStateToProps(state) {
	const data = state.users.get('data').toObject();

	return {
		usersData: {
			users: data.users.toArray(),
			page: data.page,
			numOfItems: data.numOfItems,
			numOfPages: data.numOfPages,
		},
		createManagerLoadingStatus: state.users.get('createManagerLoadingStatus'),
		updateManagerLoadingStatus: state.users.get('updateManagerLoadingStatus'),
		deleteUserLoadingStatus: state.users.get('deleteUserLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	const {
		userType,
	} = queries;

	return {
		fetchUsersAction: (...args) => dispatch(fetchUsersAction(userType, ...args)),
		createManagerAction: (...args) => dispatch(createManagerAction(...args)),
		updateManagerAction: (...args) => dispatch(updateManagerAction(...args)),
		deleteUserAction: (...args) => dispatch(deleteUserAction(...args)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagerPage);

function updatePassword(data) {
	return Object.assign(data, {
		password: undefined,
	});
}
