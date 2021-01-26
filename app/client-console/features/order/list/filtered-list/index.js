import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'ljit-react-components';
import List from '../../../../components/list';
import { Warning } from '../../../../images';
import { OrdersPropTypes } from '../../../../lib/prop-types-utils';
import Item from './item';
import '../../../../styling/confirm-modal.styl';

const propTypes = {
	userId: PropTypes.string,
	ordersData: OrdersPropTypes,
	selectedOrderId: PropTypes.string,
	hasPagination: PropTypes.bool,
	onRemoveOrder: PropTypes.func,
	onSelectedOrderId: PropTypes.func,
	onChangeNextPage: PropTypes.func,
};
const defaultProps = {
	ordersData: {},
	selectedOrderId: '',
	onChangeNextPage: () => {},
};
const MODAL_PREFIX_CLASS = 'client-container__confirm-modal';

class FilteredList extends Component {
	constructor() {
		super();

		this.state = {
			isMessageModalVisible: false,
		};

		this._handleRemoveOrder = this._handleRemoveOrder.bind(this);
		this._handleCloseMessageModal = this._handleCloseMessageModal.bind(this);
	}

	_handleCloseMessageModal() {
		this.setState({
			isMessageModalVisible: false,
		});
	}

	_handleRemoveOrder() {
		const { selectedOrderId, onRemoveOrder } = this.props;

		onRemoveOrder(selectedOrderId);
		this._handleCloseMessageModal();
	}

	render() {
		const {
			ordersData,
			hasPagination,
			onChangeNextPage,
			onSelectedOrderId,
			selectedOrderId,
			userId,
		} = this.props;
		const {
			isMessageModalVisible,
		} = this.state;
		const {
			_handleRemoveOrder,
			_handleCloseMessageModal,
		} = this;

		return (
			<>
				<List
					ordersData={ordersData}
					hasPagination={hasPagination}
					renderItems={item => (
						<Item
							userId={userId}
							selectedOrderId={selectedOrderId}
							item={item}
							onSelectedOrderId={onSelectedOrderId}
							onClickRemoveOrder={() => this.setState({
								isMessageModalVisible: true,
							})}
						/>
					)}
					onChangeNextPage={page => onChangeNextPage(page)}
				/>
				<Modal.Message
					title={
						<div className={`${MODAL_PREFIX_CLASS}-title`}>
							<img src={Warning}/>
							提示
						</div>
					}
					visible={isMessageModalVisible}
					message="确定删除此单？"
					onClickOk={_handleRemoveOrder}
					onClickCancel={_handleCloseMessageModal}
					cancelButtonClassname={`${MODAL_PREFIX_CLASS}-cancel-btn`}
					className={MODAL_PREFIX_CLASS}
				/>
			</>
		);
	}

	componentDidUpdate(prevProps) {
		const { selectedOrderId } = this.props;

		if (prevProps.selectedOrderId !== selectedOrderId) {
			this.setState({ selectedOrderId });
		}
	}
}

FilteredList.propTypes = propTypes;
FilteredList.defaultProps = defaultProps;

export default FilteredList;
