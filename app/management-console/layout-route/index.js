import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { matchRoutes } from 'react-router-config';
import { Link, withRouter, NavLink } from 'react-router-dom';
import {
	Breadcrumb,
	HeaderBanner,
	Layout,
	Icon,
	UserAvatar,
	IconButton,
	Menu,
	Dropdown,
} from 'ljit-react-components';
import routes, { RouteKeyEnums } from '../routes';
import SidebarMenu from '../components/side-bar-menu';
import { renderSwitches } from './render-routes';
import { connect } from 'ljit-store-connecter';
import { MePropTypes } from '../lib/prop-types-utils';
import { UserImagesMap } from '../../images';

const { Item: MenuItem } = Menu;
const { Header, Content } = Layout;
const {
	SEARCH,
	MENU_FOLD,
	MENU_UNFOLD,
	BELL,
} = Icon.IconTypeEnums;
const {
	ACCOUNT,
	LABEL,
	GROUP,
	LOGOUT,
} = RouteKeyEnums;
const sidebarMenuFirstLevelKeys = [
	ACCOUNT,
	LABEL,
	GROUP,
	LOGOUT,
];
const propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
	auth: PropTypes.shape({
		isAuthed: PropTypes.bool.isRequired,
	}).isRequired,
	meData: MePropTypes,
};

class LayoutRoute extends Component {
	constructor(props) {
		super(props);

		const {
			location: {
				pathname,
			},
		} = props;
		const matchedRoutes = matchRoutes(routes, pathname)
			.map(matchedRoute => matchedRoute.route.path);

		this.state = {
			isMenuCollapsed: false,
			openKeys: matchedRoutes,
			selectedKeys: [pathname],
		};

		this._handleToggle = this._handleToggle.bind(this);
		this._renderPrivateLayout = this._renderPrivateLayout.bind(this);
		this._renderPublicLayout = this._renderPublicLayout.bind(this);
		this._handleSubMenuOpenChange = this._handleSubMenuOpenChange.bind(this);
		this._handleMenuItemSelect = this._handleMenuItemSelect.bind(this);
	}

	_handleToggle() {
		const {
			location: {
				pathname,
			},
		} = this.props;
		const { isMenuCollapsed } = this.state;
		const matchedRoutes = matchRoutes(routes, pathname)
			.map(matchedRoute => matchedRoute.route.path);

		this.setState({
			isMenuCollapsed: !isMenuCollapsed,
			openKeys: isMenuCollapsed ? matchedRoutes : [],
		});
	}

	_handleSubMenuOpenChange(openKeys) {
		const latestOpenKey = openKeys.slice().pop();

		if (sidebarMenuFirstLevelKeys.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	}

	_handleMenuItemSelect({ selectedKeys }) {
		this.setState({ selectedKeys: selectedKeys.slice() });
	}

	_renderPublicLayout() {
		return (
			<Content>
				{renderSwitches(routes)}
			</Content>
		);
	}

	_renderPrivateLayout() {
		const {
			isMenuCollapsed,
			openKeys,
			selectedKeys,
		} = this.state;
		const {
			_handleSubMenuOpenChange,
			_handleMenuItemSelect,
			_handleToggle,
		} = this;
		const {
			meData,
		} = this.props;
		const {
			type,
			departmentType,
			username,
			profilePictureId,
		} = meData;
		const extraProps = {
			type,
			departmentType,
		};

		return (
			<Fragment>
				<SidebarMenu
					collapsed={isMenuCollapsed}
					title={isMenuCollapsed ? '派单' : '派单系统'}
					openKeys={openKeys}
					selectedKeys={selectedKeys}
					onSubMenuOpenChange={_handleSubMenuOpenChange}
					onMenuItemSelect={_handleMenuItemSelect}
					meData={meData}
				/>
				<Layout>
					<Header className="layout__header">
						<IconButton
							className="trigger"
							type={isMenuCollapsed ? MENU_UNFOLD : MENU_FOLD}
							style={{ color: 'rgba(0, 0, 0, 0.65)' }}
							size={IconButton.SizeEnums.LARGE}
							onClick={_handleToggle}
						/>
						<Dropdown
							dropdownContent={(
								<Menu>
									<MenuItem key="0">
										<Link to="/user">
											个人帐号设定
										</Link>
									</MenuItem>
									<MenuItem key="1">
										<Link to={LOGOUT}>
											登出
										</Link>
									</MenuItem>
								</Menu>
							)}
							trigger={['click']}
						>
							<div style={{ float: 'right', marginLeft: 26, cursor: 'pointer' }}>
								<UserAvatar
									src={UserImagesMap[profilePictureId]}
									userName={username}
								/>
							</div>
						</Dropdown>
						<div style={{ float: 'right', fontSize: 16 }}>
							<Icon type={SEARCH} size={Icon.SizeEnums.SMALL} />
							<Icon type={BELL} size={Icon.SizeEnums.SMALL} style={{ marginLeft: 27 }} />
						</div>
					</Header>
					<HeaderBanner
						breadcrumb={<Breadcrumb Item={NavLink} />}
					/>
					<Content className="layout__content">
						{renderSwitches(routes, { me: extraProps })}
					</Content>
				</Layout>
			</Fragment>
		);
	}

	render() {
		const {
			auth = {},
		} = this.props;
		const {
			isAuthed,
		} = auth;

		return (
			<Layout className="layout">
				{isAuthed ? this._renderPrivateLayout() : this._renderPublicLayout()}
			</Layout>
		);
	}
}

function mapStateToProps(state) {
	return {
		meData: state.auth.get('me').toObject(),
	};
}

LayoutRoute.propTypes = propTypes;

export default connect(mapStateToProps)(withRouter(LayoutRoute));
