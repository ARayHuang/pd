import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import { Layout } from 'ljit-react-components';
import Sidebar from './sidebar';
import OrderList from '../../features/order/list';
import OrderDetail from '../../features/order/detail';
import InvitationModal from '../../features/invitation-modal';
import {
	channelActions,
	applicationActions,
	orderActions,
	authActions,
	orderSocketActions,
} from '../../controller';
import {
	MePropTypes,
	ChannelPropTypes,
} from '../../lib/prop-types-utils';
import FavoriteChannelsModal from './favorite-channels-modal';
import { LoadingStatusEnum, OrderTypeEnums } from '../../lib/enums';
import '../../styling/layout/styles.styl';

const { setSelectedChannelAction } = channelActions;
const { initializeProviderApplicationAction } = applicationActions;
const { updateChannelSettingsAction } = authActions;
const { resetOrdersAction, setSelectedTabAction } = orderActions;
const { removeInvitationAction } = orderSocketActions;
const { LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const propTypes = {
	meData: MePropTypes.isRequired,
	selectedChannel: ChannelPropTypes,
	setSelectedChannelAction: PropTypes.func.isRequired,
	initializeProviderApplicationAction: PropTypes.func.isRequired,
	resetOrdersAction: PropTypes.func.isRequired,
	updateChannelSettingsAction: PropTypes.func.isRequired,
	acceptInvitationOrderLoadingStatus: PropTypes.oneOf(Object.values(LoadingStatusEnum)),
	setSelectedTabAction: PropTypes.func.isRequired,
	removeInvitationAction: PropTypes.func.isRequired,
	invitations: PropTypes.array.isRequired,
};

class ProviderPage extends Component {
	constructor() {
		super();

		this.state = {
			isShowFavoriteModal: false,
		};

		this._handleChangeChannel = this._handleChangeChannel.bind(this);
		this._handleSubmitFavoriteChannels = this._handleSubmitFavoriteChannels.bind(this);
		this._handleCloseListModal = this._handleCloseListModal.bind(this);
	}

	_handleChangeChannel(selectedChannelId) {
		const {
			meData,
			setSelectedChannelAction,
			resetOrdersAction,
		} = this.props;
		const { channels = [] } = meData;
		const matchedChannel = channels.filter(_channel => _channel.id === selectedChannelId)[0];

		setSelectedChannelAction(matchedChannel);
		resetOrdersAction();
	}

	_handleSubmitFavoriteChannels(list) {
		const { updateChannelSettingsAction } = this.props;
		const channelSettings = list.map(item => ({
			id: item.id,
			isFavorite: item.isFavorite,
		}));

		updateChannelSettingsAction(channelSettings);
		this._handleCloseListModal();
	}

	_handleCloseListModal() {
		this.setState({ isShowFavoriteModal: false });
	}

	render() {
		const {
			meData,
			selectedChannel,
		} = this.props;
		const {
			isShowFavoriteModal,
		} = this.state;
		const {
			displayName,
			profilePictureId,
			channelSettings,
			channels,
		} = meData;
		const {
			_handleChangeChannel,
			_handleSubmitFavoriteChannels,
			_handleCloseListModal,
		} = this;
		const favoriteList = getFavoriteChannels(channels, channelSettings);
		const sidebarChannels = favoriteList.filter(item => item.isFavorite);

		return (
			<Layout className="provider">
				<Sidebar
					selectedKeys={[selectedChannel.id]}
					channels={sidebarChannels}
					displayName={displayName}
					profilePictureId={profilePictureId}
					onChange={_handleChangeChannel}
					onClickFavorites={() => this.setState({ isShowFavoriteModal: true })}
				/>
				<Layout className="layout__left">
					<OrderList/>
				</Layout>
				<Layout className="layout__right">
					<OrderDetail selectedChannel={selectedChannel}/>
				</Layout>
				<FavoriteChannelsModal
					isVisible={isShowFavoriteModal}
					listData={favoriteList}
					onClickOk={_handleSubmitFavoriteChannels}
					onClickCancel={_handleCloseListModal}
				/>
				<InvitationModal />
			</Layout>
		);
	}

	componentDidMount() {
		const {
			meData,
			setSelectedChannelAction,
		} = this.props;
		const { channels = [] } = meData;
		const selectedChannel = channels[0];

		setSelectedChannelAction(selectedChannel);
	}

	componentDidUpdate(prevProps) {
		const {
			initializeProviderApplicationAction,
			selectedChannel,
			acceptInvitationOrderLoadingStatus,
			setSelectedTabAction,
			setSelectedChannelAction,
			removeInvitationAction,
			invitations,
		} = this.props;

		if (selectedChannel.id !== prevProps.selectedChannel.id) {
			initializeProviderApplicationAction();
		}

		if (prevProps.acceptInvitationOrderLoadingStatus === LOADING && invitations.length) {
			const [firstInvitation = {}] = invitations;
			const { id, order: { channel = {} } = {} } = firstInvitation;

			if (acceptInvitationOrderLoadingStatus === SUCCESS) {
				setSelectedChannelAction(channel);
				setSelectedTabAction(OrderTypeEnums.PROCESSING);
				removeInvitationAction(id);
			}

			if (acceptInvitationOrderLoadingStatus === FAILED) {
				removeInvitationAction(id);
			}
		}
	}
}

ProviderPage.propTypes = propTypes;

function mapStateToProps(state) {
	return {
		meData: state.auth.get('me').toObject(),
		selectedChannel: state.channel.get('data').toObject(),
		invitations: state.invitations.get('data').toArray(),
		acceptInvitationOrderLoadingStatus: state.order.get('acceptInvitationOrderLoadingStatus'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setSelectedChannelAction: channel => dispatch(setSelectedChannelAction(channel)),
		initializeProviderApplicationAction: channelId => dispatch(initializeProviderApplicationAction(channelId)),
		resetOrdersAction: () => dispatch(resetOrdersAction()),
		updateChannelSettingsAction: (...args) => dispatch(updateChannelSettingsAction(...args)),
		setSelectedTabAction: selectedTab => dispatch(setSelectedTabAction(selectedTab)),
		removeInvitationAction: id => dispatch(removeInvitationAction(id)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderPage);

function getFavoriteChannels(channels = [], channelSettings = []) {
	let list = [];

	channelSettings
		.concat(
			channels
				.filter(item => channelSettings.findIndex(e => e.id === item.id) === -1 ? item : false)
				.map(item => ({
					...item,
					isFavorite: true,
				})))
		.forEach(item => {
			const index = channels.findIndex(element => element.id === item.id);

			if (index > -1) {
				list.push({
					...item,
					name: channels[index] ? channels[index].name : '',
				});
			}
		});

	return list;
}
