import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import { DepartmentTypeEnums, UserTypeEnums } from '../../../lib/enums';
import { UserPropTypes, UsersPropTypes, ChannelOptionsPropTypes } from '../../../lib/prop-types-utils';
import { userActions, channelActions } from '../../../controller';
import ManagerPage from '../../../components/manager-page';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { usePrevious } from '../../../../lib/react-utils';

const PREFIX_CLASS = 'account-dispatchers-page';
const { PROVIDER } = DepartmentTypeEnums;
const {
	fetchUsersAction,
	createStaffAction,
	updateStaffAction,
	deleteUserAction,
} = userActions;
const { fetchChannelOptionsAction } = channelActions;
const { STAFF } = UserTypeEnums;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const propTypes = {
	meData: UserPropTypes.isRequired,
	usersData: UsersPropTypes.isRequired,
	channelOptions: ChannelOptionsPropTypes,
	fetchUsersAction: PropTypes.func.isRequired,
	createStaffAction: PropTypes.func.isRequired,
	updateStaffAction: PropTypes.func.isRequired,
	deleteUserAction: PropTypes.func.isRequired,
	fetchChannelOptionsAction: PropTypes.func.isRequired,
	createStaffLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	updateStaffLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
	deleteUserLoadingStatus: PropTypes.oneOf([NONE, LOADING, SUCCESS, FAILED]).isRequired,
};

function AccountDispatcherPage({
	meData,
	usersData,
	channelOptions,
	fetchUsersAction,
	createStaffAction,
	updateStaffAction,
	deleteUserAction,
	fetchChannelOptionsAction,
	createStaffLoadingStatus,
	updateStaffLoadingStatus,
	deleteUserLoadingStatus,
}) {
	const [queries, setQueries] = useState({});
	const prevCreateStaffLoadingStatus = usePrevious(createStaffLoadingStatus);
	const prevUpdateStaffLoadingStatus = usePrevious(updateStaffLoadingStatus);
	const prevDeleteUserLoadingStatus = usePrevious(deleteUserLoadingStatus);
	const {
		users,
		numOfItems,
		page,
	} = usersData;

	useEffect(() => {
		fetchUsersAction();
		fetchChannelOptionsAction();
	}, []);

	useEffect(() => {
		if (prevCreateStaffLoadingStatus === LOADING &&
			createStaffLoadingStatus === SUCCESS) {
			fetchUsersAction(queries);
		}
	}, [createStaffLoadingStatus]);

	useEffect(() => {
		if (prevUpdateStaffLoadingStatus === LOADING &&
			updateStaffLoadingStatus === SUCCESS) {
			fetchUsersAction(queries);
		}
	}, [updateStaffLoadingStatus]);

	useEffect(() => {
		if (prevDeleteUserLoadingStatus === LOADING &&
			deleteUserLoadingStatus === SUCCESS) {
			fetchUsersAction(queries);
		}
	}, [deleteUserLoadingStatus]);

	function _handleCreateStaff(values) {
		const {
			profilePictureId,
			shiftType,
			channelIds,
			displayName,
			password,
			username,
		} = values;

		createStaffAction({
			profilePictureId,
			shiftType,
			channelIds,
			displayName,
			password,
			username,
		});
	}

	function _handleSearchStaff(values) {
		setQueries(values);
		fetchUsersAction(values);
	}

	function _handleUpdateStaff(values) {
		const {
			id,
			_nextValues: data,
		} = values;

		updateStaffAction(id, data);
	}

	function _handleDeleteUser(values) {
		deleteUserAction(values);
	}

	return (
		<ManagerPage
			className={PREFIX_CLASS}
			me={meData}
			users={users}
			departmentType={PROVIDER}
			channelOptions={channelOptions}
			onCreate={_handleCreateStaff}
			onSearch={_handleSearchStaff}
			onUpdate={_handleUpdateStaff}
			onDelete={_handleDeleteUser}
			pagination={{
				numOfItems: numOfItems,
				page: page,
			}}
		/>
	);
}

AccountDispatcherPage.propTypes = propTypes;

function mapStateToProps(state) {
	const usersReducer = state.users.get('data').toObject();
	const channelOptions = state.channels.get('channelOptions').toArray();

	return {
		meData: state.auth.get('me').toObject(),
		usersData: {
			users: usersReducer.users.toArray(),
			page: usersReducer.page,
			numOfItems: usersReducer.numOfItems,
			numOfPages: usersReducer.numOfPages,
		},
		channelOptions,
		createStaffLoadingStatus: state.users.get('createStaffLoadingStatus'),
		updateStaffLoadingStatus: state.users.get('updateStaffLoadingStatus'),
		deleteUserLoadingStatus: state.users.get('deleteUserLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchUsersAction: (...args) => dispatch(fetchUsersAction(STAFF, PROVIDER, ...args)),
		createStaffAction: (...args) => dispatch(createStaffAction(...args)),
		updateStaffAction: (...args) => dispatch(updateStaffAction(...args)),
		deleteUserAction: (...args) => dispatch(deleteUserAction(...args)),
		fetchChannelOptionsAction: () => dispatch(fetchChannelOptionsAction()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDispatcherPage);
