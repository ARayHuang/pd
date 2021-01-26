import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Dropdown, Menu } from 'ljit-react-components';
import './style.styl';

const PREFIX_CLASS = 'dropdown-buttons';
const propTypes = {
	className: PropTypes.string,
	onClickCoOwner: PropTypes.func,
	onClickTransfer: PropTypes.func,
	isDisableCoWorkButton: PropTypes.bool,
};
const defaultProps = {
	className: '',
	onClickCoOwner: () => {},
	onClickTransfer: () => {},
	isDisableCoWorkButton: false,
};

function DropdownButtons({
	className,
	onClickCoOwner,
	onClickTransfer,
	isDisableCoWorkButton,
}) {
	function _renderDropdownMenu() {
		return (
			<div className={`${PREFIX_CLASS}--menu`}>
				<Menu>
					<Menu.Item disabled={isDisableCoWorkButton} key="co-owner" onClick={onClickCoOwner}><span>协 作</span></Menu.Item>
					<Menu.Item key="transfer" onClick={onClickTransfer}><span>转 接</span></Menu.Item>
				</Menu>
			</div>
		);
	}

	return (
		<Dropdown dropdownContent={_renderDropdownMenu()}>
			<span className={cx(PREFIX_CLASS, className)}>帮 助</span>
		</Dropdown>
	);
}

DropdownButtons.propTypes = propTypes;
DropdownButtons.defaultProps = defaultProps;

export default DropdownButtons;
