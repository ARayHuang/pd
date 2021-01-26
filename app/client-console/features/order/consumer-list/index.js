import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import {
	Layout,
	Tabs,
	Badge,
	Switch,
} from 'ljit-react-components';
import ProcessingOrders from './processing-orders';
import TrackedOrders from './tracked-orders';
import ClosedOrders from './closed-orders';
import {
	consumerOrderActions,
} from '../../../controller';
import {
	OrderTypeEnums,
} from '../../../lib/enums';
import './styles.styl';

const {
	setConsumerSelectedTabAction,
} = consumerOrderActions;
const { Content } = Layout;
const {
	PROCESSING,
	TRACKED,
	CLOSED,
} = OrderTypeEnums;
const TabTitleMap = {
	[PROCESSING]: '处理中',
	[TRACKED]: '追踪中',
	[CLOSED]: '已结单/已删除',
};
const propTypes = {
	selectedTab: PropTypes.string,
	setConsumerSelectedTabAction: PropTypes.func.isRequired,
	processingNumOfItems: PropTypes.number.isRequired,
	trackedNumOfItems: PropTypes.number.isRequired,
};

export const PREFIX_CLASS = 'consumer-order-list-page';

class ConsumerOrderList extends Component {
	constructor() {
		super();

		this.state = {
			isShowOnlyMyOrders: true,
		};

		this._handleSetSelectedTab = this._handleSetSelectedTab.bind(this);
		this._renderTabTitleWithBadge = this._renderTabTitleWithBadge.bind(this);
		this._renderShowMyOrdersSwitch = this._renderShowMyOrdersSwitch.bind(this);
		this._renderTabContent = this._renderTabContent.bind(this);
	}

	_handleSetSelectedTab(selectedTab) {
		this.props.setConsumerSelectedTabAction(selectedTab);
	}

	_renderTabTitleWithBadge(TabTitle, count) {
		return (
			<div className={`${PREFIX_CLASS}__tabs-title`}>
				{TabTitle}
				<Badge
					count={count}
					overflowCount={999}
					className
				/>
			</div>
		);
	}

	_renderShowMyOrdersSwitch() {
		const { selectedTab } = this.props;
		const { isShowOnlyMyOrders } = this.state;

		if (selectedTab === PROCESSING) {
			return (
				<div className={`${PREFIX_CLASS}__switch`}>
					<Switch
						checked={isShowOnlyMyOrders}
						onChange={checked => this.setState({ isShowOnlyMyOrders: checked })}
					/>
					显示我的派单
				</div>
			);
		}
	}

	_renderTabContent() {
		const {
			selectedTab,
			processingNumOfItems,
			trackedNumOfItems,
		} = this.props;
		const {
			_renderTabTitleWithBadge,
			_handleSetSelectedTab,
		} = this;
		const { isShowOnlyMyOrders } = this.state;

		return (
			<Tabs
				tabType={Tabs.TabTypeEnum.INLINE}
				activeKey={selectedTab}
				onChange={tabKey => {
					_handleSetSelectedTab(tabKey);
				}}
				className={`${PREFIX_CLASS}__tabs-list`}
				isAnimated={false}
			>
				<Tabs.TabPane
					tab={_renderTabTitleWithBadge(TabTitleMap[PROCESSING], processingNumOfItems)}
					key={PROCESSING}
				>
					<ProcessingOrders isShowOnlyMyOrders={isShowOnlyMyOrders}/>
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={_renderTabTitleWithBadge(TabTitleMap[TRACKED], trackedNumOfItems)}
					key={TRACKED}
				>
					<TrackedOrders />
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={TabTitleMap[CLOSED]}
					key={CLOSED}
				>
					<ClosedOrders />
				</Tabs.TabPane>
			</Tabs>
		);
	}

	render() {
		const {
			_renderTabContent,
			_renderShowMyOrdersSwitch,
		} = this;

		return (
			<div className={`layout__wrap ${PREFIX_CLASS}`}>
				<Content className="layout__content">
					{_renderTabContent()}
					{_renderShowMyOrdersSwitch()}
				</Content>
			</div>
		);
	}

	componentDidMount() {
		this._handleSetSelectedTab(PROCESSING);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {
			selectedTab,
			processingNumOfItems,
			trackedNumOfItems,
		} = this.props;
		const isChangeSelectedTab = selectedTab !== nextProps.selectedTab;
		const isChangeState = this.state !== nextState;
		const isChangeNumOfItem = nextProps.processingNumOfItems !== processingNumOfItems || nextProps.trackedNumOfItems !== trackedNumOfItems;

		return (
			isChangeSelectedTab ||
			isChangeState ||
			isChangeNumOfItem
		);
	}
}

ConsumerOrderList.propTypes = propTypes;

function mapStateToProps(state) {
	const consumerOrdersReducer = state.consumerOrders;

	return {
		fetchTagLoadingStatus: state.tag.get('loadingStatus'),
		selectedTab: consumerOrdersReducer.get('selectedTab'),
		processingNumOfItems: consumerOrdersReducer.get('processingNumOfItems'),
		trackedNumOfItems: consumerOrdersReducer.get('trackedNumOfItems'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setConsumerSelectedTabAction: selectedTab => dispatch(setConsumerSelectedTabAction(selectedTab)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerOrderList);
