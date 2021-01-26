import puppeteer from 'puppeteer';
import {
	rootURL,
	viewPortSetting,
	timeout,
	launchSetting,
} from './utils/constant';
import { getNotFoundErrorMessage } from './utils/general';

let browser;
let page;

beforeAll(async () => {
	browser = await puppeteer.launch(launchSetting);
	page = await browser.newPage();

	await page.setViewport(viewPortSetting);
	await page.goto(rootURL, { waitUntil: 'networkidle0' });
});

describe('login.case-1.e2e', () => {
	test('check login with account/password', async () => {
		const usernameSelector = '#username';

		await page.waitForSelector(usernameSelector, {
			timeout: 1000,
		}).catch(() => {
			throw new Error(getNotFoundErrorMessage(usernameSelector));
		});
	}, timeout);
});

afterAll(() => {
	if (!process.env.DEBUG) {
		browser.close();
	}
});
