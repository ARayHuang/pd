import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	Form,
	FormItem,
	InputTextarea,
	Button,
} from 'ljit-react-components';
import { ReplyIcon } from '../../../../../images';
import { formValidator } from '../../../../../../lib/validator-utils';
import './styles.styl';

const PREFIX_CLASS = 'comment-submit-form';
const propTypes = {
	onSubmitComment: PropTypes.func,
	isDisabled: PropTypes.bool,
};
const defaultProps = {
	onSubmitComment: () => {},
	isDisabled: false,
};

class CommentSubmitForm extends Component {
	constructor() {
		super();

		this._handlePressEnter = this._handlePressEnter.bind(this);
		this._handleSubmitComment = this._handleSubmitComment.bind(this);
	}

	_handlePressEnter(event) {
		if (event.key === 'Enter' && event.shiftKey === false) {
			event.preventDefault();

			this._handleSubmitComment(event);
		}
	}

	_handleSubmitComment(event) {
		event.preventDefault();

		const form = this.formInstance.getForm();

		form.validateFields((err, { content }) => {
			if (!err) {
				this.props.onSubmitComment(content);
				form.resetFields();
			}
		});
	}

	render() {
		const {
			_handlePressEnter,
			_handleSubmitComment,
			props: { isDisabled },
		} = this;
		const placeholderText = isDisabled ? '您没有权限使用这项功能' : '请输入文字讯息';

		return (
			<div className={cx(PREFIX_CLASS, { disabled: isDisabled })}>
				<Form
					submitButtonDisabled
					cancelButtonDisabled
					ref={form => {
						this.formInstance = form;
					}}
				>
					<FormItem
						label=""
						key="content"
						itemName="content"
						columnType={FormItem.ColumnTypeEnums.LARGE}
						itemConfig={{ rules: [{
							required: true,
							whitespace: true,
							validator: formValidator('讯息', 51200),
						}] }}
					>
						<InputTextarea
							maxRows={1}
							minRows={1}
							placeholder={placeholderText}
							onPressEnter={_handlePressEnter}
							disabled={isDisabled}
						/>
					</FormItem>
					<Button
						className={`${PREFIX_CLASS}__btn-submit`}
						onClick={_handleSubmitComment}
						disabled={isDisabled}
					>
						<img src={ReplyIcon} size={24} />
					</Button>
				</Form>
			</div>
		);
	}
}

CommentSubmitForm.propTypes = propTypes;
CommentSubmitForm.defaultProps = defaultProps;

export default CommentSubmitForm;
