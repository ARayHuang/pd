import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import FileComponent from '../../file';
import DefaultScreen from '../../default-screen';
import { FileTypeEnums } from '../../../lib/enums';
import { NoFileSvg } from '../../../../images';
import { OrderPropTypes } from '../../../lib/prop-types-utils';
import './styles.styl';

const { VIDEO } = FileTypeEnums;
const {
	Image,
	Video,
} = FileComponent;
const propTypes = {
	orderData: OrderPropTypes,
};
const defaultProps = {};
const PREFIX_CLASS = 'order-details';

class OrderContent extends Component {
	constructor() {
		super();

		this.state = {
			fileList: [],
		};

		this._renderDescription = this._renderDescription.bind(this);
		this._renderFiles = this._renderFiles.bind(this);
	}

	_renderDescription() {
		const { orderData: { description } = {} } = this.props;

		return (
			<div className={`${PREFIX_CLASS}__description`}>
				<div className={`${PREFIX_CLASS}__title`}>订单号</div>
				<div className={`${PREFIX_CLASS}__content`}>{description}</div>
			</div>
		);
	}

	_renderFiles() {
		const { orderData: { files = [] } = {} } = this.props;

		if (files.length) {
			return (
				files.map(file => {
					if (file.type === VIDEO) {
						return <Video file={file} key={file.id} />;
					}

					return <Image file={file} key={file.id} />;
				})
			);
		}

		return <DefaultScreen imgSvg={NoFileSvg} message="无附件档案"/>;
	}

	render() {
		const {
			orderData,
		} = this.props;
		const {
			_renderDescription,
			_renderFiles,
		} = this;
		const { files = [] } = orderData;

		return (
			<div className={PREFIX_CLASS}>
				{_renderDescription()}
				<div className={cx(
					`${PREFIX_CLASS}__attachment`,
					{ 'no-file': files.length === 0 })}
				>
					<div className={`${PREFIX_CLASS}__title`}>
						附件档案
						<div className={`${PREFIX_CLASS}__actions`}>
							<span className={`${PREFIX_CLASS}__sub-title`}>共 <b>{files.length}</b> 笔档案</span>
						</div>
					</div>
					<div
						className={`${PREFIX_CLASS}__content`}
						ref={divRef => {
							this.divInstance = divRef;
						}}>
						{_renderFiles()}
					</div>
				</div>
			</div>
		);
	}

	componentDidUpdate(prevProps) {
		const { divInstance, props } = this;

		if (!isEqual(prevProps.orderData, props.orderData) && divInstance) {
			divInstance.scrollTop = divInstance.scrollHeight;
		}
	}
}

OrderContent.propTypes = propTypes;
OrderContent.defaultProps = defaultProps;

export default OrderContent;
