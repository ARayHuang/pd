import {
	fetchers,
	generateApiFetcher,
} from '../../lib/api-fetcher';
import config from '../config';

export function getAPIBaseUrl() {
	return config.MANAGEMENT_BASE_API_URL;
}

const { rxAjaxFetcher } = fetchers;

export const rxjsApiFetcher = generateApiFetcher({
	fetcher: rxAjaxFetcher,
	baseUrl: getAPIBaseUrl(),
});
