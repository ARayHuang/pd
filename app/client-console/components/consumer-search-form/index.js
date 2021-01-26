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
import DateRangePicker from '../date-range-picker';
import { OrderTypeEnums } from '../../lib/enums';
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
	numOfItems: PropTypes.number,
	tabType: PropTypes.oneOf([PROCESSING, TRACKED, CLOSED]),
	onSearch: PropTypes.func,
};
const defaultProps = {
	numOfItems: 0,
	onSearch: () => {},
};
const tableStyle = {
	GUTTER: 24,
	SPAN: 7,
	TIME_SPAN: 10,
};
const {
	GUTTER,
	SPAN,
	TIME_SPAN,
} = tableStyle;
const PREFIX_CLASS = 'search-form';

class ConsumerSearchForm extends Component {
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

		// TODO change description to orderNumber after API update
		form.validateFields((err, { createdAt = [], customerName, description } = {}) => {
			if (!err) {
				const [from, to] = createdAt;
				const queries = {
					customerName,
					description,
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
					<Row type={Row.TypeEnums.FLEX}>
						<Row gutter={GUTTER} className={`${PREFIX_CLASS}__search-input`}>
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
									<Input placeholder="请输入订单号"/>
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
							<Col span={TIME_SPAN}>
								<FormItem
									label="开单时间"
									key="createdAt"
									itemName="createdAt"
									labelColon={false}
								>
									<DateRangePicker/>
								</FormItem>
							</Col>
						</Row>
						<Col className={`${PREFIX_CLASS}__search-button`}>
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

ConsumerSearchForm.propTypes = propTypes;
ConsumerSearchForm.defaultProps = defaultProps;

export default ConsumerSearchForm;
