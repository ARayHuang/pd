import React, { Component } from 'react';
import { Modal as AntdModal } from 'antd';
import { ImagePropTypes } from '../../lib/prop-types-utils';
import { DownloadSvg } from '../../images';
import { downloadFile, getPerformanceNow } from './utils';
import './styles.styl';

const propTypes = {
	file: ImagePropTypes,
};
const defaultProps = {
	file: {},
};
const PREFIX_CLASS = 'image-file';

class Image extends Component {
	constructor() {
		super();

		this.state = {
			isModalVisible: false,
		};

		this._handleOpenModal = this._handleOpenModal.bind(this);
		this._handleCloseModal = this._handleCloseModal.bind(this);
	}

	_handleOpenModal() {
		this.setState({
			isModalVisible: true,
		});
	}

	_handleCloseModal() {
		this.setState({
			isModalVisible: false,
		});
	}

	render() {
		const {
			url,
			filename,
			thumbnailUrl,
		} = this.props.file;
		const { isModalVisible } = this.state;
		const {
			_handleOpenModal,
			_handleCloseModal,
		} = this;
		const maskStyle = {
			backgroundColor: 'black',
			opacity: '0.81',
		};
		const modalStyle = {
			top: 0,
			left: 0,
		};
		const performanceNow = getPerformanceNow(window);

		return (
			<>
				<div
					className={PREFIX_CLASS}
					onClick={_handleOpenModal}
				>
					<img src={`${thumbnailUrl}?${performanceNow}`} alt={filename} />
				</div>
				<AntdModal
					isCentered
					width="100%"
					footer={null}
					title={filename}
					style={modalStyle}
					maskStyle={maskStyle}
					visible={isModalVisible}
					className={`${PREFIX_CLASS}--modal`}
					onCancel={_handleCloseModal}
				>
					<div className={`${PREFIX_CLASS}--modal__container`}>
						<div
							className={`${PREFIX_CLASS}--modal__btn--download`}
							onClick={() => downloadFile(url, filename)}
						>
							<img src={DownloadSvg}/>
						</div>
						<img src={`${url}?${performanceNow}`} alt={filename} />
					</div>
				</AntdModal>
			</>
		);
	}
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
