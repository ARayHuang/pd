import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import { Modal, Form, FormItem, Input, RadioGroup, LabelText, Select, UserAvatar } from 'ljit-react-components';
import { DepartmentTypeDisplayNameEnums, ShiftTypeEnums, ShiftTypeDisplayNameEnums } from '../../lib/enums';
import { formValidator } from '../../../lib/validator-utils';
import { UserImagesMap } from '../../../images';
import './style.styl';

const { MORNING, NOON, NIGHT } = ShiftTypeEnums;
const { MEDIUM } = FormItem.ColumnTypeEnums;
const { MULTIPLE } = Select.ModeEnums;
const propTypes = {
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	footer: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	okText: PropTypes.string,
	cancelText: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	isVisible: PropTypes.bool,
	onClickCancel: PropTypes.func,
	onClickOk: PropTypes.func,
	isCentered: PropTypes.bool,
	isCreateAccount: PropTypes.bool,
	initialValue: PropTypes.object,
	channelOptions: PropTypes.array,
};
const defaultProps = {
	title: '',
	className: '',
	width: '640px',
	okText: '确 定',
	cancelText: '取 消',
	isCentered: true,
	isVisible: false,
	onClickCancel: () => {},
	onClickOk: () => {},
	isCreateAccount: false,
	initialValue: {},
	channelOptions: [],
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
	width,
	okText,
	cancelText,
	footer,
	onClickCancel,
	onClickOk,
	isCentered,
	isCreateAccount,
	initialValue,
	channelOptions,
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
			width={width}
			visible={isVisible}
			onClickOk={_handleFormSubmit}
			okText={okText}
			onClickCancel={_handleFormCancel}
			okButtonClassname={`${PREFIX_CLASS}__btn-ok`}
			cancelButtonClassname={`${PREFIX_CLASS}__btn-cancel`}
			cancelText={cancelText}
			footer={footer}
			isCentered={isCentered}
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
						rules: [{
							required: true,
							whitespace: true,
							validator: formValidator('帐号', 20),
						}],
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
						rules: [{
							required: true,
							whitespace: true,
							validator: formValidator('显示名称', 1024),
						}],
					}}
				>
					<Input placeholder="请输入显示名称"/>
				</FormItem>
				<FormItem
					label="所属频道"
					itemName="channelIds"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.channels,
						rules: [{ required: true, message: '所属频道不能为空' }],
					}}
				>
					<Select
						mode={MULTIPLE}
						placeholder="请选取频道"
						style={{ width: '100%' }}
						options={channelOptions}
					/>
				</FormItem>
				<LabelText
					key={initialValue.id}
					label="所属组别:"
					text={DepartmentTypeDisplayNameEnums[initialValue.departmentType]}
					isFixedWidth={false}
					fontSize={LabelText.SizeEnums.MEDIUM}
				/>
				<FormItem
					label="班別"
					itemName="shiftType"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.shiftType,
						rules: [{ required: true, message: '班別不能为空' }],
					}}
				>
					<RadioGroup
						options={[
							{ label: ShiftTypeDisplayNameEnums[MORNING], value: MORNING },
							{ label: ShiftTypeDisplayNameEnums[NOON], value: NOON },
							{ label: ShiftTypeDisplayNameEnums[NIGHT], value: NIGHT },
						]}
					/>
				</FormItem>
				<FormItem
					label="选择头像"
					itemName="profilePictureId"
					columnType={MEDIUM}
					itemConfig={{
						initialValue: initialValue.profilePictureId,
						rules: [{ required: true, message: '头像不能为空' }],
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
			</Form>
		</Modal>
	);
}

SubmitFormModal.propTypes = propTypes;
SubmitFormModal.defaultProps = defaultProps;

export default SubmitFormModal;
