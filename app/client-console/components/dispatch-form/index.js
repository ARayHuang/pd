import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	Form,
	FormItem,
	Input,
	Row,
	Col,
	Button,
} from 'ljit-react-components';
import ClientSelect from '../client-select';
import { TagsPropTypes } from '../../lib/prop-types-utils';
import { formValidator, orderNumberValidator } from '../../../lib/validator-utils';
import './styles.styl';

const tableStyle = {
	GUTTER: 24,
	SPAN: 8,
	TWO_SPAN: 16,
};
const {
	GUTTER,
	SPAN,
	TWO_SPAN,
} = tableStyle;
const propTypes = {
	tags: TagsPropTypes,
	displayName: PropTypes.string,
	onCreateOrder: PropTypes.func,
};
const defaultProps = {
	tags: [],
	displayName: '',
	onCreateOrder: () => {},
};
const PREFIX_CLASS = 'dispatch-form';

class DispatchForm extends Component {
	constructor() {
		super();

		this._handleFormSubmit = this._handleFormSubmit.bind(this);
	}

	_handleFormSubmit(event) {
		const form = this.formInstance.getForm();

		event.preventDefault();

		form.validateFields((err, values) => {
			if (!err) {
				this.props.onCreateOrder(values);
				form.resetFields();
			}
		});
	}

	render() {
		const {
			displayName,
			tags = [],
		} = this.props;
		const {
			_handleFormSubmit,
		} = this;

		return (
			<div className={PREFIX_CLASS}>
				<Form
					cancelButtonDisabled
					submitButtonDisabled
					ref={refForm => {
						this.formInstance = refForm;
					}}
				>
					<Row gutter={GUTTER}>
						<Col span={SPAN}>
							<FormItem
								label="开单人员"
								key="owner"
								itemName="owner"
								labelColon={false}
								itemConfig={{
									initialValue: displayName,
								}}
							>
								<Input disabled />
							</FormItem>
						</Col>
						<Col span={SPAN}>
							<FormItem
								label="成员"
								key="customerName"
								itemName="customerName"
								labelColon={false}
								itemConfig={{
									rules: [{
										required: true,
										whitespace: true,
										validator: formValidator('成员', 1024),
									}],
								}}
							>
								<Input placeholder="请输入成员"/>
							</FormItem>
						</Col>
						<Col span={SPAN}>
							<FormItem
								label="开单原因"
								key="tagId"
								itemName="tagId"
								className="select-dropdown"
								labelColon={false}
								itemConfig={{
									rules: [{ required: true, message: '开单原因不能为空' }],
								}}
							>
								<ClientSelect
									options={tags}
									placeholder="请选择开单原因"
								/>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={GUTTER}>
						<Col span={TWO_SPAN}>
							<FormItem
								label="订单号"
								key="description"
								itemName="description"
								className="input-desc"
								labelColon={false}
								itemConfig={{
									rules: [{
										required: true,
										validator: orderNumberValidator(),
									}],
								}}
							>
								<Input placeholder="请输入订单号" />
							</FormItem>
						</Col>
						<Col
							span={SPAN}
							style={{ paddingTop: '24px', textAlign: 'right' }}>
							<Button
								type="submit"
								onClick={_handleFormSubmit}
								className={cx('btn--blue', 'btn--dispatch')}
							>
								开单
							</Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

DispatchForm.propTypes = propTypes;
DispatchForm.defaultProps = defaultProps;

export default DispatchForm;
