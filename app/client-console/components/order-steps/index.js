import React from 'react';
import PropTypes from 'prop-types';
import { Steps as AntdSteps } from 'antd';
import './styles.styl';
import { OrderStatusEnums } from '../../lib/enums';

const {
	CREATED,
	ACCEPTED,
	RESOLVED,
	TRACKED,
	COMPLETED,
	DELETED,
} = OrderStatusEnums;
const {
	Step: AntdStep,
} = AntdSteps;
const propTypes = {
	stepData: PropTypes.shape({
		owner: PropTypes.shape({
			id: PropTypes.string,
			displayName: PropTypes.string,
		}),
		handler: PropTypes.shape({
			id: PropTypes.string,
			displayName: PropTypes.string,
		}),
		completedVia: PropTypes.shape({
			id: PropTypes.string,
			displayName: PropTypes.string,
		}),
		resolvedVia: PropTypes.shape({
			id: PropTypes.string,
			displayName: PropTypes.string,
		}),
		status: PropTypes.oneOf([
			CREATED,
			ACCEPTED,
			RESOLVED,
			TRACKED,
			COMPLETED,
			DELETED,
		]),
	}),
	activeKey: PropTypes.number,
	onChange: PropTypes.func,
};
const defaultProps = {
	stepData: {},
	current: '',
	onChange: () => {},
};
const PREFIX_CLASS = 'order-steps';
const OderSteps = ({
	stepData,
	activeKey,
	onChange,
} = {}) => {
	const { owner = {}, handler = {}, status, completedVia, resolvedVia } = stepData;
	let ownerName = owner.displayName;
	let handlerName = handler.displayName;

	if (resolvedVia) {
		handlerName = resolvedVia.displayName;
	}

	if (completedVia) {
		ownerName = completedVia.displayName;
	}

	return (
		<AntdSteps
			progressDot
			current={activeKey}
			onChange={onChange}
			className={`${PREFIX_CLASS} ${PREFIX_CLASS}--${status}`}
			size="small"
		>
			<AntdStep title={ownerName} />
			<AntdStep title={handlerName} className={handlerName && status === ACCEPTED ? `${PREFIX_CLASS}--${status}` : null}/>
		</AntdSteps>
	);
};

OderSteps.propTypes = propTypes;
OderSteps.defaultProps = defaultProps;

export default OderSteps;
