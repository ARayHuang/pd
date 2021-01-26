# api-fetcher

shared API fetcher lib

## Usage

### 1. Install

```js
// ./utils.js

// 根據目前 import 的資料夾位置替換你的 `app/lib/api-fetcher` 路徑
import {
	fetchers,
	generateApiFetcher,
} from 'app/lib/api-fetcher';

// 選擇 fetcher 載入
const {
	rxAjaxFetcher,
} = fetchers;

// 產生實際使用的 fetcher
export const apiFetcher = generateApiFetcher({
	fetcher: rxAjaxFetcher,
	baseUrl: getAPIBaseUrl(),
});
```

### 2. Call api with redux observable

```js
import { apiFetcher, } from './utils';

export function actionEpic(action$, state$) {
	return action$.pipe(
		ofType(ACTION_TYPE_NAME),
		switchMap(action =>
			apiFetcher.get('lotteries', {
				// extra configs
			}).pipe(
				// do resolve and reject
			)
		),
	);
}
```

## Configs

### 1. generateApiFetcher

```js
generateApiFetcher({
	// 預設的 Url
	// default: '',
	// ex: 若設定的 baseUrl 為 https://api.github.com
	// 在執行 apiFetcher.get('users') 後實際的 url 會產生成 https://api.github.com/users
	baseUrl,

	// 使用該 fetcher 執行 call api
	// required
	fetcher,
});
```

### 2. http method handlers

```js
apiFetcher.get(url, configs)
apiFetcher.head(url, configs)
apiFetcher.post(url, body, configs)
apiFetcher.put(url, body, configs)
apiFetcher.patch(url, body, configs)
apiFetcher.delete(url, body, configs)

// configs
{
	// query strings
	queries,

	// http headers
	headers,
}
```

### 3. upload file

```js
// 待測試
const configs = {
	headers: {
		'Content-Type': 'multipart/form-data',
	},
};
const body = new FormData();

body.append('username', username);
body.append('userPhoto[]', userPhotos[0]);
body.append('userPhoto[]', userPhotos[1]);

apiFetcher.post(url, body, configs);
```
