import { loadComponent } from '../lib/react-utils';

const Provider = loadComponent({ loader: () => import('./pages/provider') });
const Consumer = loadComponent({ loader: () => import('./pages/consumer') });
const Login = loadComponent({ loader: () => import('./pages/login') });
const Logout = loadComponent({ loader: () => import('./pages/logout') });

export const RouteKeyEnums = {
	ROOT: '/',
	PROVIDER: '/provider',
	CONSUMER: '/consumer',
	LOGIN: '/login',
	LOGOUT: '/logout',
};

const {
	PROVIDER,
	CONSUMER,
	LOGIN,
	LOGOUT,
} = RouteKeyEnums;
const routes = [
	{
		path: PROVIDER,
		component: Provider,
	},
	{
		path: CONSUMER,
		component: Consumer,
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
