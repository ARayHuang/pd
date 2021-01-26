import {
	OrderStatusEnums,
	ClientDepartmentTypeEnums,
} from '../../lib/enums';

const {
	COMPLETED,
	DELETED,
} = OrderStatusEnums;
const {
	PROVIDER,
	CONSUMER,
} = ClientDepartmentTypeEnums;

export function checkIsMatcher(departmentType = PROVIDER, order = {}, userId = '') {
	const { owner = {}, coOwner = {}, handler = {}, coHandler = {} } = order;
	const isOwner = userId === owner.id;
	const isCoOwner = userId === coOwner.id;
	const isHandler = userId === handler.id;
	const isCoHandler = userId === coHandler.id;

	return (
		departmentType === CONSUMER &&
		(isHandler || isCoHandler)
	) ||
	(
		departmentType === PROVIDER &&
		(isOwner || isCoOwner)
	);
}

export function checkHasActions(departmentType = PROVIDER, order = {}, userId = '') {
	const { status } = order;

	if (checkIsMatcher(departmentType, order, userId)) {
		return !checkIsOrderClosed(status);
	}

	return false;
}

export function checkIsOrderClosed(status) {
	return status === COMPLETED || status === DELETED;
}

export function checkIsShowButtons(selectedOrderId, hasActions, handler) {
	return selectedOrderId && (hasActions || !handler);
}

export function checkHasOrderById(orderId = '', orders = []) {
	return orders.findIndex(_order => _order.id === orderId);
}

export function checkIsOwnerOrCoOwner(ownerId, coOwnerId, userId) {
	return ownerId === userId || coOwnerId === userId;
}
