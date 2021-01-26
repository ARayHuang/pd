import moment from 'moment';

export const DATE = 'YYYY-MM-DD';
export const DATE_TIME_SECONDS = 'YYYY/MM/DD HH:mm:ss';

export function isDateValid(date) {
	return date ? moment(date).isValid() : false;
}

export function formatDate(date = new Date(), format = DATE_TIME_SECONDS) {
	return moment(date).format(format);
}

export function convertDateStringToTimestamp(dateString = '', format = DATE_TIME_SECONDS) {
	return moment(dateString, format).valueOf();
}

export function convertStartOfDayToDateTimeString(from) {
	return moment(from).startOf('day').toISOString();
}

export function convertEndOfDayToDateTimeString(to) {
	return moment(to).endOf('day').toISOString();
}
