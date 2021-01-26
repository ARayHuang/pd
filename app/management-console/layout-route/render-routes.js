import React from 'react';
import { Switch } from 'react-router-dom';
import BannerRoute from './banner-route';

function renderRoutes(routePaths, routes, extraProps = {}) {
	return routes.map((route, i) => (
		<BannerRoute
			key={route.key || i}
			path={route.path}
			exact={route.exact}
			strict={route.strict}
			component={route.component}
			extraProps={extraProps}
			route={route}
			routePaths={routePaths}
		/>
	));
}

export function renderSwitches(routes, extraProps = {}, switchProps = {}) {
	return routes ? (
		<Switch {...switchProps}>
			{renderRoutes([], routes, extraProps)}
		</Switch>
	) : null;
}
