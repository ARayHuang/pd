import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	Form,
	FormItem,
	Input,
	Row,
	Col,
	Button,
} from 'ljit-react-components';
import ClientSelect from '../client-select';
import DateRangePicker from '../../components/date-range-picker';
import { OrderTypeEnums } from '../../lib/enums';
import { TagsPropTypes } from '../../lib/prop-types-utils';
import {
	convertStartOfDayToDateTimeString,
	convertEndOfDayToDateTimeString,
} from '../../../lib/moment-utils';
import { orderNumberValidator } from '../../../lib/validator-utils';

import './styles.styl';

const {
	PROCESSING,
	TRACKED,
	CLOSED,
} = OrderTypeEnums;
const propTypes = {
	tags: TagsPropTypes,
	numOfItems: PropTypes.number,
	tabType: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED]),
	onSearch: PropTypes.func,
};
const defaultProps = {
	tags: [],
	numOfItems: 0,
	onSearch: () => {},
};
const tableStyle = {
	GUTTER: 24,
	SPAN: 8,
};
const {
	GUTTER,
	SPAN,
} = tableStyle;
const PREFIX_CLASS = 'search-form';

class SearchForm extends Component {
	constructor() {
		super();

		this.formInstance = {
			[PROCESSING]: null,
			[TRACKED]: null,
			[CLOSED]: null,
		};

		this._handleFormSearch = this._handleFormSearch.bind(this);
	}

	_handleFormSearch(event) {
		const { tabType, onSearch } = this.props;
		const form = this.formInstance[tabType].getForm();

		event.preventDefault();

		form.validateFields((err, { createdAt = [], owner, customerName, tagId, handler, description } = {}) => {
			if (!err) {
				const [from, to] = createdAt;
				const queries = {
					owner,
					description,
					customerName,
					tagId,
					handler,
					from: from ? convertStartOfDayToDateTimeString(from) : null,
					to: to ? convertEndOfDayToDateTimeString(to) : null,
				};

				onSearch(queries);
			}
		});
	}

	render() {
		const {
			tabType,
			numOfItems,
			tags = [],
		} = this.props;
		const {
			_handleFormSearch,
		} = this;

		return (
			<div className={PREFIX_CLASS}>
				<Form
					cancelButtonDisabled
					submitButtonDisabled
					ref={refForm => {
						this.formInstance[tabType] = refForm;
					}}
				>
					<Row gutter={GUTTER}>
						<Col span={SPAN}>
							<FormItem
								label="开单人员"
								key="owner"
								itemName="owner"
								labelColon={false}
							>
								<Input placeholder="请输入开单人员"/>
							</FormItem>
						</Col>
						<Col span={SPAN}>
							<FormItem
								label="成员"
								key="customerName"
								itemName="customerName"
								labelColon={false}
							>
								<Input placeholder="请输入成员"/>
							</FormItem>
						</Col>
						<Col span={SPAN}>
							<FormItem
								label="开单原因"
								key="tagId"
								itemName="tagId"
								className="select-dropdown"
								labelColon={false}
							>
								<ClientSelect
									options={tags}
									placeholder="请选择开单原因"
								/>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={GUTTER}>
						<Col span={SPAN}>
							<FormItem
								label="订单号"
								key="orderNumber"
								itemName="description"
								labelColon={false}
								itemConfig={{
									rules: [{
										validator: orderNumberValidator(),
									}],
								}}
							>
								<Input placeholder="请输入订单号" />
							</FormItem>
						</Col>
						<Col span={SPAN}>
							<FormItem
								label="开单时间"
								key="createdAt"
								itemName="createdAt"
								labelColon={false}
							>
								<DateRangePicker/>
							</FormItem>
						</Col>
						<Col
							span={SPAN}
							style={{ paddingTop: '24px', textAlign: 'right' }}
						>
							<span className={`${PREFIX_CLASS}__total-counts`}>
								共<b>{numOfItems}</b>笔
							</span>

							<Button
								type="submit"
								onClick={_handleFormSearch}
								className={cx('btn--grey', 'btn--filtered')}
							>
								筛选
							</Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

SearchForm.propTypes = propTypes;
SearchForm.defaultProps = defaultProps;

export default SearchForm;
