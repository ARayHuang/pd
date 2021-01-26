import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	Icon,
	Layout,
	Affix,
	Menu,
} from 'ljit-react-components';
import { RouteKeyEnums } from '../../routes';
import RoleRulesMenuItem from './role-access-menu-item';
import { RuleEnums } from '../../configs/role-access-config';
import { MePropTypes } from '../../lib/prop-types-utils';
import './style.styl';

const {
	LOG,
	ACCOUNT,
	CHANNEL,
	TAG,
	ACCOUNT_MANAGER,
	ACCOUNT_DISPATCHERS,
	ACCOUNT_HANDLERS,
} = RouteKeyEnums;
const { Sider } = Layout;
const {
	SubMenu,
	Item: MenuItem,
} = Menu;
const {
	CHECK_CIRCEL,
	TABLE,
	PROJECT,
} = Icon.IconTypeEnums;
const {
	ACCOUNT_MANAGER_PAGE,
	ACCOUNT_DISPATCHERS_PAGE,
	ACCOUNT_HANDLERS_PAGE,
} = RuleEnums;
const propTypes = {
	collapsed: PropTypes.bool,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	meData: MePropTypes,
	openKeys: PropTypes.arrayOf(PropTypes.string),
	selectedKeys: PropTypes.arrayOf(PropTypes.string),
	// Function(openKeys: string[])
	onSubMenuOpenChange: PropTypes.func,
	// Function({ item, key, selectedKeys })
	onMenuItemSelect: PropTypes.func,
};
const defaultProps = {
	collapsed: false,
	onSubMenuOpenChange: () => {},
	onMenuItemSelect: () => {},
};

class SideBarMenu extends Component {
	render() {
		const {
			collapsed,
			title,
			openKeys,
			selectedKeys,
			onSubMenuOpenChange,
			onMenuItemSelect,
			meData,
		} = this.props;
		const sidebarMenuWidth = collapsed ? '31px' : '214px';
		const {
			type,
			departmentType,
		} = meData;

		return (
			<div className="sidebar-menu__wrapper">
				<Affix>
					<Sider
						trigger={null}
						collapsible
						collapsed={collapsed}
						width={sidebarMenuWidth}
						className="sidebar-menu"
					>
						<div className="sidebar-menu__title">{title}</div>
						<Menu
							themeType={Menu.ThemeTypeEnums.DARK}
							modeType={Menu.ModeTypeEnums.INLINE}
							openKeys={openKeys}
							selectedKeys={selectedKeys}
							onSubMenuOpenChange={onSubMenuOpenChange}
							onMenuItemSelect={onMenuItemSelect}
							inlineCollapsed={collapsed}
						>
							<MenuItem key={LOG}>
								<Link to={LOG}><Icon type={CHECK_CIRCEL} size="middle"/>历史纪录</Link>
							</MenuItem>
							<SubMenu
								key={ACCOUNT}
								title={<Fragment><Icon type={TABLE} size="middle" /><span>帐号管理</span></Fragment>}
							>
								<RoleRulesMenuItem
									role={type}
									functionCode={ACCOUNT_MANAGER_PAGE}
								>
									<Link to={ACCOUNT_MANAGER}>开/接单主管帐号</Link>
								</RoleRulesMenuItem>
								<RoleRulesMenuItem
									role={type}
									functionCode={ACCOUNT_DISPATCHERS_PAGE}
									dynamicArgs={{ departmentType }}
								>
									<Link to={ACCOUNT_DISPATCHERS}>开单组</Link>
								</RoleRulesMenuItem>
								<RoleRulesMenuItem
									role={type}
									functionCode={ACCOUNT_HANDLERS_PAGE}
									dynamicArgs={{ departmentType }}
								>
									<Link to={ACCOUNT_HANDLERS}>接单组</Link>
								</RoleRulesMenuItem>
							</SubMenu>
							<MenuItem key={CHANNEL}>
								<Link to={CHANNEL}><Icon type={PROJECT} size="middle" />频道管理</Link>
							</MenuItem>
							<MenuItem key={TAG}>
								<Link to={TAG}><Icon type={CHECK_CIRCEL} size="middle" />标签管理</Link>
							</MenuItem>
						</Menu>
					</Sider>
				</Affix>
			</div>
		);
	}
}

SideBarMenu.propTypes = propTypes;
SideBarMenu.defaultProps = defaultProps;

export default SideBarMenu;
