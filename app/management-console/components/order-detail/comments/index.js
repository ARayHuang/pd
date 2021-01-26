import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import Comment from './comment';
import DefaultScreen from '../../default-screen';
import { OrderCommentsPropTypes } from '../../../lib/prop-types-utils';
import './styles.styl';

const propTypes = {
	commentsData: OrderCommentsPropTypes,
};
const defaultProps = {
	commentsData: [],
};

export const PREFIX_CLASS = 'order-comments';

class OrderComments extends Component {
	constructor() {
		super();

		this._renderComments = this._renderComments.bind(this);
	}

	_renderComments() {
		const { commentsData } = this.props;

		if (commentsData.length) {
			return commentsData.map(comment => {
				return <Comment key={comment.id} comment={comment} />;
			});
		}

		return <DefaultScreen className="no-comments" message="无留言"/>;
	}

	render() {
		const {
			commentsData,
		} = this.props;
		const {
			_renderComments,
		} = this;

		return (
			<div className={cx(PREFIX_CLASS, { 'whole-height': commentsData.length === 0 })}>
				<div className={`${PREFIX_CLASS}__title`}>
					留言
				</div>
				<div
					className={`${PREFIX_CLASS}__body`}
					ref={divRef => {
						this.divInstance = divRef;
					}}
				>
					{_renderComments()}
				</div>
			</div>
		);
	}

	componentDidUpdate(prevProps) {
		const { divInstance, props } = this;

		if (!isEqual(prevProps.commentsData, props.commentsData) && divInstance) {
			divInstance.scrollTop = divInstance.scrollHeight;
		}
	}
}

OrderComments.propTypes = propTypes;
OrderComments.defaultProps = defaultProps;

export default OrderComments;
