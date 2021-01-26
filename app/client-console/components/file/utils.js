import { Notify } from 'ljit-react-components';

const DEFAULT_NAME = 'download';

export function downloadFile(url, fileName = DEFAULT_NAME) {
	fetch(url, { cache: 'no-cache' })
		.then(response => {
			Notify.info('档案开始下载', 2000);
			return response.blob();
		})
		.then(blob => {
			const reader = new FileReader();

			reader.readAsDataURL(blob);
			reader.addEventListener('load', () => {
				const nextUrl = URL.createObjectURL(blob);
				const anchorElement = document.createElement('a');

				anchorElement.setAttribute('href', nextUrl);
				anchorElement.setAttribute('download', fileName);
				anchorElement.click();
				URL.revokeObjectURL(nextUrl);
			});
		})
		.catch(() => {
			Notify.error('档案下载失败', 2000);
		});
}

export function getPerformanceNow(window) {
	if (window && window.performance && typeof window.performance.now === 'function') {
		return window.performance.now();
	}

	return String(Math.random() * 100000);
}
