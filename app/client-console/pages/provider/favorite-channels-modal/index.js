import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Modal,
	Switch,
	DraggableTableInput,
} from 'ljit-react-components';
import { EditSvg } from '../../../images';
import './styles.styl';

const propTypes = {
	listData: PropTypes.array,
	isVisible: PropTypes.bool,
	onClickOk: PropTypes.func,
	onClickCancel: PropTypes.func,
};
const defaultProps = {
	listData: [],
	isVisible: false,
	onClickOk: () => {},
	onClickCancel: () => {},
};
const PREFIX_CLASS = 'favorite-channels';
const FAVORITES_MODAL_WIDTH = 350;

function FavoriteChannelsModal({
	listData,
	isVisible,
	onClickOk,
	onClickCancel,
}) {
	const [favoriteList, setFavoriteList] = useState(listData);

	useEffect(() => {
		setFavoriteList(listData);
	}, [listData]);

	function _renderSwitch(isChecked, record) {
		return (
			<Switch
				checked={isChecked}
				onChange={() => _handleChangeFavoriteChannel(record)}
			/>
		);
	}

	function _handleChangeFavoriteChannel(record) {
		const currentChannels = favoriteList.filter(_channel => _channel.isFavorite);
		const counts = currentChannels.length;
		const isExactlyOneChannel = counts === 1 && record.id === currentChannels[0].id;

		if (!isExactlyOneChannel) {
			const updatedFavoritesList = favoriteList.map(item => {
				let channel = { ...item };

				if (item.id === record.id) {
					channel.isFavorite = !record.isFavorite;
				}

				return channel;
			});

			setFavoriteList(updatedFavoritesList);
		}
	}

	return (
		<Modal
			isCentered
			width={FAVORITES_MODAL_WIDTH}
			title={<>
				<img src={EditSvg} />
				编辑收藏频道
			</>}
			className={`${PREFIX_CLASS}-modal`}
			visible={isVisible}
			cancelButtonClassname="ljit-btn btn--grey"
			onClickOk={() => onClickOk(favoriteList)}
			onClickCancel={onClickCancel}
		>
			<div className={`${PREFIX_CLASS}__list`}>
				<DraggableTableInput
					rowKey="id"
					tableName={`${PREFIX_CLASS}__list-table`}
					className={`${PREFIX_CLASS}__list-draggable-table`}
					alignType={DraggableTableInput.AlignTypeEnums.LEFT}
					value={favoriteList}
					onChange={updatedFavoriteIds => setFavoriteList(updatedFavoriteIds)}
					columns={[
						{
							dataIndex: 'name',
							title: '频道名称',
							width: 150,
						},
						{
							dataIndex: 'isFavorite',
							title: '收藏',
							width: 100,
							render: (isFavorite, record) => _renderSwitch(isFavorite, record),
						},
					]}
				/>
			</div>
		</Modal>
	);
}

FavoriteChannelsModal.propTypes = propTypes;
FavoriteChannelsModal.defaultProps = defaultProps;

export default FavoriteChannelsModal;
