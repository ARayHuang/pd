import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker as AntdDatePicker } from 'antd';
import { DATE } from '../../../lib/moment-utils';
import './styles.styl';

const AntdRangePicker = AntdDatePicker.RangePicker;
const HourOffset = 0;
const LastThirtyDays = moment().clone().subtract(29, 'days').startOf('day').add(0, 'hour');
const PresetRanges = {
	今天: [moment(), moment()],
	七天以內: [moment().clone().subtract(6, 'days').startOf('day').add(HourOffset, 'hour'), moment().clone().endOf('day').add(HourOffset, 'hour')],
	七天以上: [LastThirtyDays, moment().clone().endOf('day').add(HourOffset, 'hour')],
};
const disabledDate = current => current < LastThirtyDays.startOf('day');
const PREFIX_CLASS = 'date-range-picker';
const propTypes = {
	className: PropTypes.string,
};

class DateRangePicker extends Component {
	render() {
		return (
			<div>
				<AntdRangePicker
					{...this.props}
					ranges={PresetRanges}
					format={DATE}
					dropdownClassName={`${PREFIX_CLASS}__date-range-picker-dropdown`}
					disabledDate={disabledDate}
				/>
			</div>
		);
	}
}

DateRangePicker.propTypes = propTypes;

export default DateRangePicker;
