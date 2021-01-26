import React from 'react';
import { VideoPropTypes } from '../../lib/prop-types-utils';
import { VideoFileSvg } from '../../../images';
import { formatDate } from '../../../lib/moment-utils';
import { downloadFile } from './utils';
import './styles.styl';

const propTypes = {
	file: VideoPropTypes,
};
const defaultProps = {
	file: {},
};
const PREFIX_CLASS = 'video-file';

function Video({
	file,
} = {}) {
	const {
		url,
		filename,
		createdAt,
	} = file;

	return (
		<div className={PREFIX_CLASS}>
			<div
				title={filename}
				className={`${PREFIX_CLASS}__file`}
				onClick={() => downloadFile(url, filename)}
			>
				<img src={VideoFileSvg} size="28x36" />
				<div className={`${PREFIX_CLASS}__file-content`}>
					<div className={`${PREFIX_CLASS}__file-title`} >{filename}</div>
					<div className={`${PREFIX_CLASS}__file-date`}>{formatDate(createdAt)}</div>
				</div>
			</div>
		</div>
	);
}

Video.propTypes = propTypes;
Video.defaultProps = defaultProps;

export default Video;
