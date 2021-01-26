import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PageBlock from '../../components/page-block';
import {
	renderStatus,
	labelStatusMap,
	getStatusOptions,
} from '../../lib/status-tag-utils';
import {
	CollapsableForm,
	FormItem,
	Input,
	Select,
	Table,
	Button,
	TextButton,
	Divider,
	Modal,
} from 'ljit-react-components';
import TagModal from './tag-modal';
import { tagActions } from '../../controller';
import { connect } from 'ljit-store-connecter';
import { TagsPropTypes } from '../../lib/prop-types-utils';
import { getRandomTagBackgroundColor } from '../../lib/tag-color-utils';
import './style.styl';

const PREFIX_CLASS = 'tag-page';
const { Message } = Modal;
const DEFAULT_FONT_COLOR = 'FFFFFF';
const {
	fetchTagsAction,
	createTagAction,
	updateTagAction,
	deleteTagAction,
} = tagActions;
const propTypes = {
	tagsData: TagsPropTypes.isRequired,
	fetchTagsAction: PropTypes.func.isRequired,
	createTagAction: PropTypes.func.isRequired,
	updateTagAction: PropTypes.func.isRequired,
	deleteTagAction: PropTypes.func.isRequired,
};

function TagPage({
	tagsData,
	fetchTagsAction,
	createTagAction,
	updateTagAction,
	deleteTagAction,
}) {
	const formRef = useRef(null);
	const [current, setCurrent] = useState({});
	const [isCreatedModalVisible, setIsCreatedModalVisible] = useState(false);
	const [isUpdatedModalVisible, setIsUpdatedModalVisible] = useState(false);
	const [isConfirmDeleteMessageVisible, setIsConfirmDeleteMessageVisible] = useState(false);

	useEffect(() => {
		fetchTagsAction();
	}, []);

	function _handleSearch() {
		const form = formRef.current.getForm();

		form.validateFields((error, { name, status }) => {
			if (!error) {
				fetchTagsAction({ name, status });
			}
		});
	}

	function _handleReset() {
		const form = formRef.current.getForm();

		form.resetFields();
	}

	function _handleCreateTag({ name, status }) {
		const currentBackgroundColors = tagsData.map(tag => tag.backgroundColor);
		const backgroundColor = getRandomTagBackgroundColor(currentBackgroundColors);

		createTagAction(name, status, backgroundColor, DEFAULT_FONT_COLOR);
		setIsCreatedModalVisible(false);
	}

	function _handleUpdateTag({ status }) {
		const { id: tagId } = current;

		updateTagAction(tagId, status);
		setIsUpdatedModalVisible(false);
	}

	function _handleDeleteTag() {
		const { id: tagId } = current;

		deleteTagAction(tagId);
		setIsConfirmDeleteMessageVisible(false);
	}

	function _renderOperation(record) {
		return (
			<>
				<TextButton
					color="danger"
					text="删除"
					onClick={() => {
						setIsConfirmDeleteMessageVisible(true);
						setCurrent(record);
					}}
				/>
				<Divider type="vertical" />
				<TextButton
					text="修改"
					onClick={() => {
						setIsUpdatedModalVisible(true);
						setCurrent(record);
					}}
				/>
			</>
		);
	}

	return (
		<PageBlock className={PREFIX_CLASS}>
			<CollapsableForm
				ref={formRef}
				onSubmit={_handleSearch}
				onCancel={_handleReset}
				submitText="查询"
				cancelText="重置"
				expand={false}
				collapseChildren={[
					<FormItem
						key="name"
						label="标签名称"
						itemName="name"
					>
						<Input placeholder="请输入显示名称"/>
					</FormItem>,
					<FormItem
						key="status"
						label="状态"
						itemName="status"
					>
						<Select
							placeholder="请选择"
							options={[
								{ label: '全部', value: null },
								...getStatusOptions(labelStatusMap),
							]}
						/>
					</FormItem>,
				]}
				collapseType={CollapsableForm.CollapseTypeEnum.INSERTROW}
			/>
			<div>
				<Button
					icon="plus"
					className={`${PREFIX_CLASS}__create-button`}
					color={Button.ColorEnums.BRIGHTBLUE500}
					onClick={() => setIsCreatedModalVisible(true)}
				>
					新增标签
				</Button>
				<Table
					size={Table.TableSizeEnums.LARGE}
					dataSource={tagsData}
					rowKey="id"
					columns={[
						{
							title: '标签名称',
							dataIndex: 'name',
							width: '33%',
						},
						{
							title: '状态',
							dataIndex: 'status',
							render: renderStatus(labelStatusMap),
							width: '33%',
						},
						{
							title: '操作',
							render: _renderOperation,
							width: '33%',
						},
					]}
				/>
			</div>
			<TagModal
				title="修改标签"
				isVisible={isUpdatedModalVisible}
				dataSource={current}
				onCancel={() => setIsUpdatedModalVisible(false)}
				onSubmit={_handleUpdateTag}
				isDisableLabelNameEdit
			/>
			<TagModal
				title="新增标签"
				isVisible={isCreatedModalVisible}
				onCancel={() => setIsCreatedModalVisible(false)}
				onSubmit={_handleCreateTag}
			/>
			<Message
				visible={isConfirmDeleteMessageVisible}
				title="提示"
				message="确定删除此标签？"
				onClickOk={_handleDeleteTag}
				onClickCancel={() => setIsConfirmDeleteMessageVisible(false)}
			/>
		</PageBlock>
	);
}

function mapStateToProps(state) {
	const data = state.tags;

	return {
		tagsData: data.getIn(['data', 'tags']).toArray(),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchTagsAction: queries => dispatch(fetchTagsAction(queries)),
		createTagAction: (name, status, backgroundColor, fontColor) => dispatch(createTagAction(name, status, backgroundColor, fontColor)),
		updateTagAction: (tagId, status) => dispatch(updateTagAction(tagId, status)),
		deleteTagAction: tagId => dispatch(deleteTagAction(tagId)),
	};
}

TagPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(TagPage);
