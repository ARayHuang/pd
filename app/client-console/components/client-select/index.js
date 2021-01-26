import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import './style.styl';

const { Option } = Select;
const propTypes = {
	defaultValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array,
	]),
	placeholder: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.node,
		]),
		value: PropTypes.string,
	})),
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
};
const defaultProps = {
	options: [],
	onChange: () => {},
	onBlur: () => {},
	onFocus: () => {},
};
const defaultMode = 'default';
const disabled = false;
const isShowSearch = false;
const filterOption = true;
const allowClear = true;
const ClientSelect = React.forwardRef(({
	defaultValue,
	value,
	onChange,
	onBlur,
	onFocus,
	placeholder,
	options,
}, ref) => {
	function _renderOption(option = {}) {
		const { label, value } = option;

		return <Option className="ljit-form-select__option" key={value} value={value}>{label}</Option>;
	}

	return (
		<Select
			ref={ref}
			className="pd-client-select"
			dropdownClassName="pd-client-select-dropdown"
			defaultValue={defaultValue}
			value={value}
			placeholder={placeholder}
			options={options}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}
			disabled={disabled}
			mode={defaultMode}
			showSearch={isShowSearch}
			filterOption={filterOption}
			allowClear={allowClear}
		>
			{options && options.map(_renderOption)}
		</Select>
	);
});

ClientSelect.displayName = 'ClientSelect';
ClientSelect.propTypes = propTypes;
ClientSelect.defaultProps = defaultProps;

export default ClientSelect;
