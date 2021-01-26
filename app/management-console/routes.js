import { loadComponent } from '../lib/react-utils';
import { withRole } from './lib/role-access-controller/index';
import { RuleEnums } from './configs/role-access-config';

const {
	ACCOUNT_MANAGER_PAGE,
	ACCOUNT_DISPATCHERS_PAGE,
	ACCOUNT_HANDLERS_PAGE,
} = RuleEnums;
const Log = loadComponent({ loader: () => import('./pages/log') });
const Account = loadComponent({ loader: () => import('./pages/account') });
const AccountManager = loadComponent({ loader: () => import('./pages/account/manager') });
const AccountDispatchers = loadComponent({ loader: () => import('./pages/account/dispatchers') });
const AccountHandlers = loadComponent({ loader: () => import('./pages/account/handlers') });
const Channel = loadComponent({ loader: () => import('./pages/channel') });
const Tag = loadComponent({ loader: () => import('./pages/tag') });
const Login = loadComponent({ loader: () => import('./pages/login') });
const Logout = loadComponent({ loader: () => import('./pages/logout') });

export const RouteKeyEnums = {
	ROOT: '/',
	LOG: '/log',
	ACCOUNT: '/account',
	CHANNEL: '/channel',
	TAG: '/tag',
	LOGIN: '/login',
	LOGOUT: '/logout',

	ACCOUNT_MANAGER: '/account/manager',
	ACCOUNT_DISPATCHERS: '/account/dispatchers',
	ACCOUNT_HANDLERS: '/account/handlers',
};

const {
	LOG,
	ACCOUNT,
	CHANNEL,
	TAG,
	LOGIN,
	LOGOUT,
	ACCOUNT_MANAGER,
	ACCOUNT_DISPATCHERS,
	ACCOUNT_HANDLERS,
} = RouteKeyEnums;
const routes = [
	{
		path: LOG,
		component: Log,
		meta: {
			breadcrumbName: '历史纪录',
		},
		routes: [],
	},
	{
		path: ACCOUNT,
		component: Account,
		meta: {
			breadcrumbName: '帐号管理',
			isCrumbActive: false,
		},
		routes: [
			{
				path: ACCOUNT_MANAGER,
				component: withRole(ACCOUNT_MANAGER_PAGE)(AccountManager),
				meta: {
					breadcrumbName: '开/接单主管帐号',
				},
			},
			{
				path: ACCOUNT_DISPATCHERS,
				component: withRole(ACCOUNT_DISPATCHERS_PAGE)(AccountDispatchers),
				meta: {
					breadcrumbName: '开单组',
				},
			},
			{
				path: ACCOUNT_HANDLERS,
				component: withRole(ACCOUNT_HANDLERS_PAGE)(AccountHandlers),
				meta: {
					breadcrumbName: '接单组',
				},
			},
		],
	},
	{
		path: CHANNEL,
		component: Channel,
		meta: {
			breadcrumbName: '频道管理',
		},
		routes: [],
	},
	{
		path: TAG,
		component: Tag,
		meta: {
			breadcrumbName: '标签管理',
		},
		routes: [],
	},
	{
		path: LOGIN,
		component: Login,
	},
	{
		path: LOGOUT,
		component: Logout,
	},
];

export default routes;
