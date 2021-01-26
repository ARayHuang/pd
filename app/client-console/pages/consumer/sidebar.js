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
	Badge,
} from 'ljit-react-components';
import { List as AntdList } from 'antd';
import { MePropTypes } from '../../lib/prop-types-utils';
import { RouteKeyEnums } from '../../routes';
import { ChannelsPropTypes } from '../../lib/prop-types-utils';
import { UserImagesMap } from '../../../images';
import { OrderListWhiteSvg } from '../../images';

const { LOGOUT } = RouteKeyEnums;
const { Sider } = Layout;
const { Item: MenuItem } = Menu;
const {
	AlignmentEnums,
	SizeEnums,
} = UserAvatar;
const {
	DOWN,
} = Icon.IconTypeEnums;
const { X_SMALL } = Icon.SizeEnums;
const propTypes = {
	displayName: PropTypes.string,
	profilePictureId: PropTypes.string,
	channels: ChannelsPropTypes,
	meData: MePropTypes,
	selectedKeys: PropTypes.array,
	count: PropTypes.number,
	createdOrders: PropTypes.array,
	onDoubleClick: PropTypes.func,
};
const defaultProps = {
	meData: {},
	selectedKeys: [],
	count: 0,
	onDoubleClick: () => {},
};
const SidebarMenuWidth = '140px';
const PREFIX_CLASS = 'sidebar-menu';

class Sidebar extends Component {
	constructor() {
		super();

		this._renderCreatedOrderList = this._renderCreatedOrderList.bind(this);
	}

	_renderCreatedOrderList() {
		const {
			count,
			createdOrders,
			onDoubleClick,
		} = this.props;
		const header = (
			<div className={`${PREFIX_CLASS}__order-list-header`}>
				<img src={OrderListWhiteSvg} width={13} height={16} />
				接单区
				<Badge
					count={count}
					overflowCount={999}
					className
				/>
			</div>
		);

		if (createdOrders) {
			return (
				<div className={`${PREFIX_CLASS}__order-list`}>
					<AntdList
						header={header}
						dataSource={createdOrders}
						renderItem={item => (
							<div onDoubleClick={() => onDoubleClick(item)}>
								<AntdList.Item>
									<div>{item.channel.name}</div>
								</AntdList.Item>
							</div>
						)}
						locale={{
							emptyText: '尚无任何派单',
						}}
					/>
				</div>
			);
		}

		return null;
	}

	render() {
		const {
			displayName,
			profilePictureId,
		} = this.props;
		const { _renderCreatedOrderList } = this;

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
				{_renderCreatedOrderList()}
			</Sider>
		);
	}
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
