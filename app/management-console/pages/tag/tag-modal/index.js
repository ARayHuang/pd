import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
	Modal,
	Form,
	FormItem,
	Input,
	RadioGroup,
} from 'ljit-react-components';
import {
	labelStatusMap,
	getStatusOptions,
} from '../../../lib/status-tag-utils';
import { formValidator } from '../../../../lib/validator-utils';
import './style.styl';

const statusOptions = getStatusOptions(labelStatusMap);
const PREFIX_CLASS = 'tag-modal';
const propTypes = {
	isVisible: PropTypes.bool,
	isDisableLabelNameEdit: PropTypes.bool,
	title: PropTypes.string,
	dataSource: PropTypes.object,
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func,
};
const defaultProps = {
	isVisible: false,
	isDisableLabelNameEdit: false,
	title: '修改标签',
	dataSource: {},
	onSubmit: () => {},
	onCancel: () => {},
};

function TagModal({
	isVisible,
	isDisableLabelNameEdit,
	title,
	dataSource,
	onSubmit,
	onCancel,
}) {
	const formRef = useRef(null);
	const { name, status } = dataSource;

	function _handleClickOk() {
		const form = formRef.current.getForm();

		form.validateFields((error, values) => {
			if (!error) {
				onSubmit(values);
				form.resetFields();
			}
		});
	}

	function _handleClickCancel() {
		const form = formRef.current.getForm();

		form.resetFields();
		onCancel();
	}

	return (
		<Modal
			visible={isVisible}
			onClickOk={_handleClickOk}
			onClickCancel={_handleClickCancel}
			title={title}
			modalSize={Modal.ModalSizeEnum.SMALL}
			className={PREFIX_CLASS}
		>
			<Form
				ref={formRef}
				cancelButtonDisabled
				submitButtonDisabled
			>
				<FormItem
					label="标签名称"
					itemName="name"
					itemConfig={{
						initialValue: name,
						rules: [{
							required: true,
							whitespace: true,
							validator: formValidator('标签名称', 5),
						}],
					}}
				>
					<Input
						placeholder="请输入标签名称"
						disabled={isDisableLabelNameEdit}
					/>
				</FormItem>
				<FormItem
					label="状态"
					itemName="status"
					itemConfig={{
						initialValue: status || statusOptions[0].value,
						rules: [{
							required: true,
							message: '请选择状态',
						}],
					}}
				>
					<RadioGroup
						options={statusOptions}
					/>
				</FormItem>
			</Form>
		</Modal>
	);
}

TagModal.propTypes = propTypes;
TagModal.defaultProps = defaultProps;

export default TagModal;
