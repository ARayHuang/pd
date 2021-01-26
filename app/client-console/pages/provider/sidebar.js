import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	Layout,
	Menu,
	UserAvatar,
	Icon,
	Dropdown,
	Divider,
} from 'ljit-react-components';
import { RouteKeyEnums } from '../../routes';
import { ChannelsPropTypes } from '../../lib/prop-types-utils';
import { UserImagesMap } from '../../../images';

const { LOGOUT } = RouteKeyEnums;
const { Sider } = Layout;
const { Item: MenuItem } = Menu;
const {
	AlignmentEnums,
	SizeEnums,
} = UserAvatar;
const {
	LOCK_OUTLINE,
	DOWN,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const propTypes = {
	displayName: PropTypes.string,
	profilePictureId: PropTypes.string,
	channels: ChannelsPropTypes,
	selectedKeys: PropTypes.array,
	onChange: PropTypes.func,
	onClickFavorites: PropTypes.func,
};
const defaultProps = {
	channels: [],
	selectedKeys: [],
	onChange: () => {},
	onClickFavorites: () => {},
};
const SidebarMenuWidth = '140px';
const PREFIX_CLASS = 'sidebar-menu';

class Sidebar extends Component {
	constructor() {
		super();

		this._renderChannels = this._renderChannels.bind(this);
	}

	_renderChannels() {
		const {
			selectedKeys,
			channels,
			onChange,
		} = this.props;

		if (!channels) {
			return null;
		}

		return (
			<Menu
				selectedKeys={selectedKeys}
				themeType={Menu.ThemeTypeEnums.DARK}
				modeType={Menu.ModeTypeEnums.INLINE}
				onMenuItemSelect={({ key }) => onChange(key)}
			>
				{channels.map(_channel => {
					const { id, name } = _channel;

					return (
						<MenuItem key={id}>
							<div>
								<Icon
									type={LOCK_OUTLINE}
									size={Icon.SizeEnums.SMALL}
								/>
								{name}
							</div>
						</MenuItem>
					);
				})}
			</Menu>
		);
	}

	render() {
		const {
			displayName,
			profilePictureId,
			onClickFavorites,
		} = this.props;
		const { _renderChannels } = this;

		return (
			<Sider
				collapsible
				trigger={null}
				collapsed={false}
				width={SidebarMenuWidth}
				className={PREFIX_CLASS}
			>
				<div className={`${PREFIX_CLASS}__header`}>
					<UserAvatar
						alignment={AlignmentEnums.TOP}
						size={SizeEnums.DEFAULT}
						src={UserImagesMap[profilePictureId]}
					/>
					<Dropdown
						className={`${PREFIX_CLASS}__dropdown`}
						dropdownContent={(
							<Menu>
								<MenuItem key="favorites">
									<div onClick={() => onClickFavorites()}>
										编辑收藏频道
									</div>
								</MenuItem>
								<MenuItem key="logout">
									<Link to={LOGOUT}>
										登出
									</Link>
								</MenuItem>
							</Menu>
						)}
						trigger={['click']}
					>
						<div className={`${PREFIX_CLASS}__username`}>
							<div title={displayName}>{displayName}</div>
							<Icon type={DOWN} size={X_SMALL}/>
						</div>
					</Dropdown>
					<Divider />
				</div>
				{_renderChannels()}
			</Sider>
		);
	}
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
