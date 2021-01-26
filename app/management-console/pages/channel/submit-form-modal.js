import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, FormItem, Input } from 'ljit-react-components';
import { formValidator } from '../../../lib/validator-utils';

const WIDTH = '640px';
const { MEDIUM } = FormItem.ColumnTypeEnums;
const propTypes = {
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	className: PropTypes.string,
	isVisible: PropTypes.bool,
	onClickCancel: PropTypes.func,
	onClickOk: PropTypes.func,
	initialValue: PropTypes.object,
};
const defaultProps = {
	title: '',
	className: '',
	isVisible: false,
	onClickCancel: () => {},
	onClickOk: () => {},
	initialValue: {},
	isCreateAccount: false,
};
const PREFIX_CLASS = 'channel-submit-form-modal';

function SubmitFormModal({
	title,
	className,
	isVisible,
	onClickCancel,
	onClickOk,
	initialValue,
} = {}) {
	const formInstance = useRef(null);

	function _handleFormSubmit() {
		const { validateFields, resetFields } = formInstance.current.getForm();

		validateFields((err, values) => {
			if (!err) {
				onClickOk(values);
				resetFields();
			}
		});
	}

	function _handleFormCancel() {
		const { resetFields } = formInstance.current.getForm();

		onClickCancel();
		resetFields();
	}

	return (
		<Modal
			className={className}
			title={title}
			width={WIDTH}
			visible={isVisible}
			onClickOk={_handleFormSubmit}
			onClickCancel={_handleFormCancel}
			okButtonClassname={`${PREFIX_CLASS}__btn-ok`}
			cancelButtonClassname={`${PREFIX_CLASS}__btn-cancel`}
			isCentered
		>
			<Form
				ref={formInstance}
				cancelButtonDisabled
				submitButtonDisabled
			>
				<FormItem
					label="频道名称"
					itemName="name"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.name,
						rules: [{
							required: true,
							whitespace: true,
							validator: formValidator('频道名称', 4),
						}],
					}}
				>
					<Input placeholder="请输入频道名称" />
				</FormItem>
			</Form>
		</Modal>
	);
}

SubmitFormModal.propTypes = propTypes;
SubmitFormModal.defaultProps = defaultProps;

export default SubmitFormModal;
