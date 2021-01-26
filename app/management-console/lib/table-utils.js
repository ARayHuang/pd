const OrderEnums = {
	ASCEND: 'ascend',
	DESCEND: 'descend',
};
const {
	ASCEND,
	DESCEND,
} = OrderEnums;
const OrderMap = {
	[ASCEND]: 'asc',
	[DESCEND]: 'desc',
};
const DEFAULT_PAGE = 1;

export function getTableQuery({ queries = {}, pagination = {}, filters = {}, sorter = {}, columnMap = {} }) {
	const { order, columnKey } = sorter;
	const { status = [] } = filters;
	const { page: prevPage } = queries;
	const { current: page } = pagination;
	const data = {
		query: {
			...queries,
			order: OrderMap[order],
			sort: columnMap[columnKey] || columnKey,
			status: status.length ? status.slice(-1)[0] : undefined,
		},
		pagination,
	};

	if (prevPage === page) {
		data.query.page = DEFAULT_PAGE;
		data.pagination.current = DEFAULT_PAGE;
	} else {
		data.query.page = page;
	}

	return data;
}
