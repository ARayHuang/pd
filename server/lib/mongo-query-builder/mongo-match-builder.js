class mongoMatchBuilder {
	constructor() {
		this.matchClause = [];
	}

	setIn(key, value) {
		const operator = '$in';

		this.setMatchClause(operator, key, value);

		return this;
	}

	setEqual(key, value) {
		const operator = '$eq';

		this.setMatchClause(operator, key, value);

		return this;
	}

	setRegex(key, value) {
		const operator = '$regex';

		this.setMatchClause(operator, key, value);

		return this;
	}

	setGte(key, value) {
		const operator = '$gte';

		this.setMatchClause(operator, key, value);

		return this;
	}

	setLte(key, value) {
		const operator = '$lte';

		this.setMatchClause(operator, key, value);

		return this;
	}

	setMatchClause(operator, key, value) {
		if (value === undefined || value === null) {
			return;
		}

		this.matchClause.push({ [key]: { [operator]: value } });
	}

	setClause(key, value) {
		if (value === undefined || value === null) {
			return;
		}

		this.matchClause.push({ [key]: value });
	}

	build() {
		if (this.matchClause.length === 0) {
			return {};
		}

		return { $and: this.matchClause };
	}
}

module.exports = mongoMatchBuilder;
