import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'ljit-store-connecter';
import {
	Layout,
	Tabs,
	Icon,
	Badge,
} from 'ljit-react-components';
import ProcessingOrders from './processing-orders';
import TrackedOrders from './tracked-orders';
import ClosedOrders from './closed-orders';
import DispatchForm from '../../../components/dispatch-form';
import {
	orderActions,
	tagActions,
} from '../../../controller';
import {
	MePropTypes,
	TagsPropTypes,
	ChannelPropTypes,
} from '../../../lib/prop-types-utils';
import {
	OrderTypeEnums,
	ClientDepartmentTypeEnums,
} from '../../../lib/enums';
import './styles.styl';

const {
	setSelectedTabAction,
	createOrderAction,
} = orderActions;
const { fetchTagsAction } = tagActions;
const {
	Header,
	Content,
} = Layout;
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
const {
	PROVIDER,
	CONSUMER,
	OWNER,
} = ClientDepartmentTypeEnums;
const {
	LOCK_OUTLINE,
} = Icon.IconTypeEnums;
const {
	LARGE,
} = Icon.SizeEnums;
const propTypes = {
	meData: MePropTypes.isRequired,
	tagsData: TagsPropTypes,
	processingNumOfItems: PropTypes.number,
	trackedNumOfItems: PropTypes.number,
	selectedTab: PropTypes.string,
	departmentType: PropTypes.oneOf([PROVIDER, CONSUMER, OWNER]).isRequired,
	selectedChannel: ChannelPropTypes.isRequired,
	setSelectedTabAction: PropTypes.func.isRequired,
	fetchTagsAction: PropTypes.func.isRequired,
	createOrderAction: PropTypes.func.isRequired,
};
const defaultProps = {
	tagsData: [],
};

export const PREFIX_CLASS = 'order-list-page';

class OrderList extends Component {
	constructor() {
		super();

		this._handleCreateOrder = this._handleCreateOrder.bind(this);
		this._handleSetSelectedTab = this._handleSetSelectedTab.bind(this);
		this._renderDispatchForm = this._renderDispatchForm.bind(this);
		this._renderTabTitleWithBadge = this._renderTabTitleWithBadge.bind(this);
		this._renderTabContent = this._renderTabContent.bind(this);
	}

	_handleCreateOrder(values) {
		const {
			selectedChannel,
			createOrderAction,
		} = this.props;
		const channelId = selectedChannel.id;
		const {
			description,
			tagId,
			customerName,
		} = values;

		createOrderAction(channelId, { tagId, customerName, description });
	}

	_handleSetSelectedTab(selectedTab) {
		this.props.setSelectedTabAction(selectedTab);
	}

	_renderDispatchForm() {
		const {
			departmentType,
			meData,
			tagsData,
		} = this.props;
		const { displayName } = meData;
		const { _handleCreateOrder } = this;
		const tags = getTagOptions(tagsData);

		if (departmentType === CONSUMER) {
			return null;
		}

		return (
			<DispatchForm
				displayName={displayName}
				onCreateOrder={_handleCreateOrder}
				tags={tags}
			/>
		);
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

	_renderTabContent() {
		const {
			tagsData,
			selectedTab,
			processingNumOfItems,
			trackedNumOfItems,
		} = this.props;
		const {
			_renderDispatchForm,
			_handleSetSelectedTab,
			_renderTabTitleWithBadge,
		} = this;
		const tags = getTagOptions(tagsData);

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
					{_renderDispatchForm()}
					<ProcessingOrders tags={tags} />
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={_renderTabTitleWithBadge(TabTitleMap[TRACKED], trackedNumOfItems)}
					key={TRACKED}
				>
					<TrackedOrders tags={tags}/>
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={TabTitleMap[CLOSED]}
					key={CLOSED}
				>
					<ClosedOrders tags={tags}/>
				</Tabs.TabPane>
			</Tabs>
		);
	}

	render() {
		const { selectedChannel } = this.props;
		const { _renderTabContent } = this;

		return (
			<div className={`layout__wrap ${PREFIX_CLASS}`}>
				<Header className="layout__header">
					<div className="layout__header__title">
						<Icon
							type={LOCK_OUTLINE}
							size={LARGE}
						/>
						{selectedChannel.name}
					</div>
				</Header>
				<Content className="layout__content">
					{_renderTabContent()}
				</Content>
			</div>
		);
	}

	componentDidMount() {
		const {
			fetchTagsAction,
		} = this.props;

		this._handleSetSelectedTab(PROCESSING);

		fetchTagsAction();
	}

	componentDidUpdate(prevProps) {
		const {
			selectedChannel,
		} = this.props;

		if (prevProps.selectedChannel.id !== selectedChannel.id) {
			this._handleSetSelectedTab(PROCESSING);
		}
	}

	shouldComponentUpdate(nextProps) {
		const {
			selectedTab,
			tagsData,
			processingNumOfItems,
			trackedNumOfItems,
		} = this.props;
		const isTabChanged = selectedTab !== nextProps.selectedTab;
		const isTagUpdated = tagsData !== nextProps.tagsData;
		const isOrdersChanged = processingNumOfItems !== nextProps.processingNumOfItems ||
			trackedNumOfItems !== nextProps.trackedNumOfItems;

		return isTabChanged || isTagUpdated || isOrdersChanged;
	}
}

OrderList.propTypes = propTypes;
OrderList.defaultProps = defaultProps;

function mapStateToProps(state) {
	const ordersReducer = state.orders;

	return {
		meData: state.auth.get('me').toObject(),
		departmentType: state.auth.get('departmentType'),
		selectedChannel: state.channel.get('data').toObject(),
		selectedTab: state.orders.get('selectedTab'),
		tagsData: state.tag.get('data').toArray(),
		processingNumOfItems: ordersReducer.get('processingNumOfItems'),
		trackedNumOfItems: ordersReducer.get('trackedNumOfItems'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setSelectedTabAction: selectedTab => dispatch(setSelectedTabAction(selectedTab)),
		fetchTagsAction: () => dispatch(fetchTagsAction()),
		createOrderAction: (...args) => (dispatch(createOrderAction(...args))),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);

function getTagOptions(tags = []) {
	return tags.map(_tag => {
		const { id, name } = _tag;

		return {
			key: id,
			label: name,
			value: id,
		};
	});
}
