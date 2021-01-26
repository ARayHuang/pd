import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ManualUpload } from 'ljit-react-components';
import { AddSvg } from '../../images';

// Video formats refer to https://www.reneelab.net/video-extention.html
const AcceptExtensions = [
	'jpg',
	'jpeg',
	'png',
	'mov',
	'qt',
	'flv',
	'avi',
	'wmv',
	'asf',
	'mpeg',
	'mpg',
	'vob',
	'mp4',
	'm4v',
	'rm',
	'rmvb',
	'dat',
	'ts',
];
const propTypes = {
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
	fileList: PropTypes.array,
	fileLimit: PropTypes.number,
};
const defaultProps = {
	className: '',
	fileLimit: 1,
};
const PREFIX_CLASS = 'multiple-upload';

class MultipleUpload extends Component {
	constructor() {
		super();
		this._handleFileChange = this._handleFileChange.bind(this);
		this._handelFileBeforeUpload = this._handelFileBeforeUpload.bind(this);
	}

	_handleFileChange(info) {
		this.props.onChange(info.fileList);
	}

	_handelFileBeforeUpload(file) {
		this.props.onChange([...this.props.fileList, file]);
	}

	render() {
		const {
			className,
			fileList,
			fileLimit,
		} = this.props;
		const {
			_handleFileChange,
			_handelFileBeforeUpload,
		} = this;

		return (
			<ManualUpload
				className={`${PREFIX_CLASS} ${className}`}
				listType={ManualUpload.ListTypeEnums.TEXT}
				acceptExtentions={AcceptExtensions}
				fileList={fileList}
				fileLimit={fileLimit}
				remindText={null}
				onChange={_handleFileChange}
				beforeUpload={_handelFileBeforeUpload}
			>
				<img src={AddSvg}/>
			</ManualUpload>
		);
	}
}

MultipleUpload.propTypes = propTypes;
MultipleUpload.defaultProps = defaultProps;

export default MultipleUpload;
