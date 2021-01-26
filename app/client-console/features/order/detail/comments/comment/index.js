import React from 'react';
import {
	Avatar,
} from 'ljit-react-components';
import { formatDate } from '../../../../../../lib/moment-utils';
import { CommentPropTypes } from '../../../../../lib/prop-types-utils';
import { UserImagesMap } from '../../../../../../images';
import './styles.styl';

const propTypes = {
	comment: CommentPropTypes,
};
const defaultProps = {
	comment: {},
};
const PREFIX_CLASS = 'comment';

function Comment({
	comment,
} = {}) {
	const {
		user,
		content,
		createdAt,
	} = comment;
	const {
		displayName,
		profilePictureId,
	} = user;

	function _renderComment() {
		const matchedURLs = getMatchUrls(content);
		let displayContent = content;

		if (matchedURLs) {
			const convertedUrls = new Set([]);

			matchedURLs.forEach(url => {
				const trimUrl = url.trim();

				if (!convertedUrls.has(trimUrl)) {
					const splittedContent = displayContent.split(trimUrl);
					const replaceUrl = `<a href="${trimUrl}" target="_blank" key="${trimUrl}" rel="${trimUrl}">${trimUrl}</a>`;

					convertedUrls.add(trimUrl);
					displayContent = splittedContent.join(replaceUrl);
				}
			});

			return <div className={`${PREFIX_CLASS}__content`} dangerouslySetInnerHTML={{ __html: displayContent }} />;
		}

		return <div className={`${PREFIX_CLASS}__content`}>{content}</div>;
	}

	return (
		<div className={PREFIX_CLASS}>
			<div className={`${PREFIX_CLASS}__avatar`}>
				<Avatar src={UserImagesMap[profilePictureId]}/>
			</div>
			<div className={`${PREFIX_CLASS}__body`}>
				<div className={`${PREFIX_CLASS}__meta`}>
					<span className={`${PREFIX_CLASS}__display-name`}>{displayName}</span>
					<span className={`${PREFIX_CLASS}__date`}>{formatDate(createdAt)}</span>
				</div>
				{_renderComment()}
			</div>
		</div>
	);
}

function getMatchUrls(content) {
	/* eslint-disable */
	const LINK_DETECTION_REGEX = /(https?):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/)?([^\s\]\)）」}』]+|$)/gi;
	/* eslint-enable */
	const urlRegex = new RegExp(LINK_DETECTION_REGEX);

	return content.match(urlRegex);
}

Comment.propTypes = propTypes;
Comment.defaultProps = defaultProps;

export default Comment;
