import React from 'react';
import Content from './content';
import Comments from './comments';
import { OrderPropTypes, OrderCommentsPropTypes } from '../../lib/prop-types-utils';

const propTypes = {
	orderData: OrderPropTypes,
	commentsData: OrderCommentsPropTypes,
};
const PREFIX_CLASS = 'order-detail';

function OrderDetail({ orderData, commentsData }) {
	return (
		<>
			<div className={`layout__wrap ${PREFIX_CLASS}`}>
				<Content orderData={orderData}/>
				<Comments commentsData={commentsData}/>
			</div>
		</>
	);
}

OrderDetail.propTypes = propTypes;

export default OrderDetail;
