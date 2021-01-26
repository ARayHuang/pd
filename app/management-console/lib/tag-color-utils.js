const BackgroundColorList = [
	'D96554',
	'F3914E',
	'FFBB43',
	'68AC21',
	'2BCFAC',
	'AE76EB',
	'2F7AAC',
	'9D7D41',
	'48C2F2',
	'56585D',
];

export function getRandomTagBackgroundColor(currentBackgroundColors = []) {
	const currentTotalItems = currentBackgroundColors.length;
	const lastestColor = currentBackgroundColors[currentTotalItems - 1];
	const colorCounts = currentBackgroundColors.reduce((group, value) => {
		group[value] = (group[value] || 0) + 1;

		return group;
	}, {});
	const currentTotalColors = Object.keys(colorCounts).length;
	const average = currentTotalItems / currentTotalColors || 0;
	const filteredBackgroundColorList = BackgroundColorList.filter(color => colorCounts[color] ? colorCounts[color] < average : true);

	if (filteredBackgroundColorList.length > 0) {
		return getRandomListItem(filteredBackgroundColorList);
	}

	return getRandomListItem(BackgroundColorList.filter(color => color !== lastestColor));
}

function getRandomListItem(list = []) {
	return list[Math.floor(Math.random() * list.length)];
}
