import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../../components/list';
import Item from './item';
import { OrdersPropTypes } from '../../../../lib/prop-types-utils';
import '../../../../styling/confirm-modal.styl';

const propTypes = {
	userId: PropTypes.string,
	ordersData: OrdersPropTypes,
	selectedOrderId: PropTypes.string,
	hasPagination: PropTypes.bool,
	onSelectedOrderId: PropTypes.func,
	onChangeNextPage: PropTypes.func,
	scrollRefProps: PropTypes.object,
};
const defaultProps = {
	ordersData: {},
	selectedOrderId: '',
	onChangeNextPage: () => {},
};

function FilteredList({
	ordersData,
	hasPagination,
	onChangeNextPage,
	userId,
	scrollRefProps,
	selectedOrderId,
	onSelectedOrderId,
}) {
	return (
		<List
			ordersData={ordersData}
			hasPagination={hasPagination}
			renderItems={item => (
				<Item
					userId={userId}
					scrollRefProps={scrollRefProps}
					selectedOrderId={selectedOrderId}
					onSelectedOrderId={onSelectedOrderId}
					item={item}
				/>
			)}
			onChangeNextPage={page => onChangeNextPage(page)}
		/>
	);
}

FilteredList.propTypes = propTypes;
FilteredList.defaultProps = defaultProps;

export default FilteredList;
