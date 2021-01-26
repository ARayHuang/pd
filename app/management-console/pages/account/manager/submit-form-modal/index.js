import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import { Modal, Form, FormItem, Input, RadioGroup, LabelText, UserAvatar, CheckBox } from 'ljit-react-components';
import { DepartmentTypeDisplayNameEnums, DepartmentTypeEnums } from '../../../../lib/enums';
import { formValidator } from '../../../../../lib/validator-utils';
import { UserImagesMap } from '../../../../../images';

const WIDTH = '640px';
const { MEDIUM } = FormItem.ColumnTypeEnums;
const { PROVIDER, CONSUMER } = DepartmentTypeEnums;
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
	isCreateAccount: PropTypes.bool,
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
const PREFIX_CLASS = 'submit-form-modal';
const AVATAR_SIZE = 64;
const EditAccountSetting = {
	placeholder: '********',
	isRequired: false,
	extraMessage: '若没有输入，则不更改',
	validator: null,
};
const {
	placeholder,
	isRequired,
	extraMessage,
	validator,
} = EditAccountSetting;

function SubmitFormModal({
	title,
	className,
	isVisible,
	onClickCancel,
	onClickOk,
	initialValue,
	isCreateAccount,
} = {}) {
	const formInstance = useRef(null);

	function _handleFormSubmitClick() {
		const { validateFields, resetFields } = formInstance.current.getForm();

		validateFields((err, values) => {
			if (!err) {
				onClickOk(values);
				resetFields();
			}
		});
	}

	function _handleFormCancelClick() {
		const { resetFields } = formInstance.current.getForm();

		onClickCancel();
		resetFields();
	}

	function _renderSubmitModalDepartmentType() {
		if (isCreateAccount) {
			return (
				<FormItem
					label="所属组别"
					itemName="departmentType"
					columnType={MEDIUM}
					itemConfig={{ rules: [{ required: true, message: '所属组别不能为空' }] }}
				>
					<RadioGroup
						options={[
							{ label: DepartmentTypeDisplayNameEnums[PROVIDER], value: PROVIDER },
							{ label: DepartmentTypeDisplayNameEnums[CONSUMER], value: CONSUMER },
						]}
					/>
				</FormItem>
			);
		}

		return (
			<LabelText
				key={initialValue.id}
				label="所属组别:"
				text={DepartmentTypeDisplayNameEnums[initialValue.departmentType]}
				isFixedWidth={false}
				fontSize={LabelText.SizeEnums.MEDIUM}
			/>
		);
	}

	return (
		<Modal
			className={className}
			title={title}
			width={WIDTH}
			visible={isVisible}
			onClickOk={_handleFormSubmitClick}
			onClickCancel={_handleFormCancelClick}
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
					label="帐号"
					itemName="username"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.username,
						rules: [{ required: true, message: '帐号不能为空' }],
					}}
				>
					<Input placeholder="请输入帐号" disabled={!isCreateAccount}/>
				</FormItem>
				<FormItem
					label="密码"
					itemName="password"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.password,
						rules: [{
							required: isCreateAccount ? true : isRequired,
							whitespace: true,
							validator: isCreateAccount ? formValidator('密码', 1024) : validator,
						}],
					}}
					extraMessage={isCreateAccount ? null : extraMessage }
				>
					<Input placeholder={ isCreateAccount ? '请输入密码' : placeholder}/>
				</FormItem>
				<FormItem
					label="显示名称"
					itemName="displayName"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.displayName,
						rules: [{ required: true, message: '显示名称不能为空' }],
					}}
				>
					<Input placeholder="请输入显示名称"/>
				</FormItem>
				{_renderSubmitModalDepartmentType()}
				<FormItem
					label="选择头像"
					itemName="profilePictureId"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.profilePictureId,
						rules: [{ required: true, message: '选择头像不能为空' }],
					}}
				>
					<Radio.Group className={`${PREFIX_CLASS}__radio-avatar-selector`}>
						{Object.keys(UserImagesMap).map(key => (
							<Radio.Button value={key} key={key}>
								<UserAvatar
									alignment={UserAvatar.AlignmentEnums.TOP}
									size={AVATAR_SIZE}
									src={UserImagesMap[key]}
								/>
							</Radio.Button>
						))}
					</Radio.Group>
				</FormItem>
				<FormItem
					label=" "
					labelColon={false}
					itemName="hasPermissionToAddStaff"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: Boolean(initialValue.hasPermissionToAddStaff),
					}}
				>
					<CheckBox className={`${PREFIX_CLASS}__permission-check-box`}>可新增部門人員帳號</CheckBox>
				</FormItem>
			</Form>
		</Modal>
	);
}

SubmitFormModal.propTypes = propTypes;
SubmitFormModal.defaultProps = defaultProps;

export default SubmitFormModal;
