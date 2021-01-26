import { ajax } from 'rxjs/ajax';
import {
	buildFullPath,
	buildUrl,
} from '../utils';

function rxAjaxFetcher({
	baseUrl,
	url,
	queries,
	body,
	headers,
	method,
} = {}) {
	const fullPath = buildFullPath(baseUrl, url);

	return ajax({
		body,
		headers,
		method,
		url: buildUrl(fullPath, queries),
	});
}

export default rxAjaxFetcher;
