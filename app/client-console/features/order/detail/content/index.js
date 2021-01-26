import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Spin } from 'antd';
import cx from 'classnames';
import {
	Form,
	FormItem,
} from 'ljit-react-components';
import FileComponent from '../../../../components/file';
import MultipleUpload from '../../../../components/multiple-upload';
import DefaultScreen from '../../../../components/default-screen';
import CopyableText from '../../../../components/copyable-text';
import EditModal from '../modal';
import { FileTypeEnums } from '../../../../lib/enums';
import { OrderPropTypes } from '../../../../lib/prop-types-utils';
import { EditOrderNumberSvg, NoFileSvg } from '../../../../../images';
import './styles.styl';

const { VIDEO } = FileTypeEnums;
const {
	Image,
	Video,
} = FileComponent;
const propTypes = {
	orderData: OrderPropTypes.isRequired,
	onEditOrderNumber: PropTypes.func,
	onUploadFile: PropTypes.func,
	isFileLoading: PropTypes.bool,
	hasActions: PropTypes.bool,
	hasEditIcon: PropTypes.bool,
};
const defaultProps = {
	onEditOrderNumber: () => {},
	onUploadFile: () => {},
	isFileLoading: false,
	hasActions: false,
	hasEditIcon: true,
};
const PREFIX_CLASS = 'order-details';

class OrderContent extends Component {
	constructor() {
		super();

		this.state = {
			fileList: [],
			isEditModalVisible: false,
		};

		this._handleUploadFile = this._handleUploadFile.bind(this);
		this._handleEditOrderNumber = this._handleEditOrderNumber.bind(this);
		this._renderDescription = this._renderDescription.bind(this);
		this._renderFiles = this._renderFiles.bind(this);
		this._renderAttachForm = this._renderAttachForm.bind(this);
	}

	_handleUploadFile(fileList) {
		const { onUploadFile } = this.props;
		const form = this.formInstance.getForm();

		this.setState({ fileList });

		form.validateFields((err, { imageFile }) => {
			if (!err && Array.isArray(imageFile)) {
				const targetFile = imageFile.pop();

				if (targetFile instanceof File) {
					onUploadFile(targetFile);
				}
			}
		});
	}

	_handleEditOrderNumber(orderNumber) {
		const { orderData, onEditOrderNumber } = this.props;
		const { id } = orderData;

		onEditOrderNumber(id, orderNumber);
		this.setState({ isEditModalVisible: false });
	}

	_renderDescription() {
		// 由於規格修改，订单号欄位為 "description"
		const { orderData: { description }, hasEditIcon } = this.props;

		return (
			<div className={`${PREFIX_CLASS}__order-number`}>
				<div className={`${PREFIX_CLASS}__title`}>订单号</div>
				<div className={`${PREFIX_CLASS}__content`}>
					<div className={`${PREFIX_CLASS}__copyable-text`}>
						<CopyableText text={description}/>
					</div>
					{hasEditIcon && <div
						className={`${PREFIX_CLASS}__edit`}
						onClick={() => this.setState({ isEditModalVisible: true })}
					>
						<img src={EditOrderNumberSvg}/>
					</div>}
				</div>
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

	_renderAttachForm() {
		const { fileList } = this.state;

		return (
			<div className={`${PREFIX_CLASS}__action ${PREFIX_CLASS}__action--upload`}>
				<Form
					submitButtonDisabled
					cancelButtonDisabled
					ref={refForm => {
						this.formInstance = refForm;
					}}
				>
					<FormItem
						label=""
						itemName="imageFile"
						columnType={FormItem.ColumnTypeEnums.SMALL}
					>
						<MultipleUpload
							fileList={fileList}
							onChange={fileList => this._handleUploadFile(fileList)}
						/>
					</FormItem>
				</Form>
			</div>
		);
	}

	render() {
		const {
			orderData,
			hasActions,
			isFileLoading,
		} = this.props;
		const {
			_renderDescription,
			_renderFiles,
			_renderAttachForm,
		} = this;
		const { isEditModalVisible } = this.state;
		const tipContent = '档案加载中...';
		// 由於規格修改，订单号欄位為 "description"
		const { files = [], description } = orderData;

		return (
			<div className={PREFIX_CLASS}>
				{_renderDescription()}
				<Spin spinning={isFileLoading} size="large" tip={tipContent}>
					<div className={cx(
						`${PREFIX_CLASS}__attachment`,
						{ 'no-file': files.length === 0 })}
					>
						<div className={`${PREFIX_CLASS}__title`}>
							附件档案
							<div className={`${PREFIX_CLASS}__actions`}>
								<span className={`${PREFIX_CLASS}__sub-title`}>共 <b>{files.length}</b> 笔档案</span>
								{hasActions ? _renderAttachForm() : null}
							</div>
						</div>
						<div
							className={`${PREFIX_CLASS}__content`}
							ref={divRef => {
								this.divInstance = divRef;
							}}>
							{_renderFiles(hasActions)}
						</div>
					</div>
				</Spin>
				<EditModal
					isVisible={isEditModalVisible}
					orderNumber={description}
					onClickOk={this._handleEditOrderNumber}
					onClickCancel={() => this.setState({ isEditModalVisible: false })}
				/>
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
