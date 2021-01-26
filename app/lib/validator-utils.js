export function formValidator(name, length) {
	return function (rule, value, callback) {
		if (rule.required && !value) {
			callback(`${name}不能为空`);
		} else if (rule.required && value && value.length > length) {
			callback(`${name}不能超过${length}个字元`);
		} else if (rule.whitespace && !value.trim()) {
			callback(`${name}不能只输入空白键`);
		}

		callback();
	};
}

export function orderNumberValidator() {
	return function (rule, value, callback) {
		if (value && value.length < 5) {
			callback('订单号长度最少5码');
		} else if (value && value.length > 30) {
			callback('订单号长度最多30码');
		}

		callback();
	};
}
