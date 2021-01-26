import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, matchPath, Redirect } from 'react-router-dom';
import { Breadcrumb, HeaderBanner } from 'ljit-react-components';
import omit from 'lodash/omit';
import { renderSwitches } from './render-routes';
import {
	paramReplace,
	getRouteMetaConfig,
	getUpdatedMeta,
} from './utils';

const propTypes = {
	route: PropTypes.shape({
		meta: PropTypes.shape({
			breadcrumbName: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.node,
			]),
			isCrumbActive: PropTypes.bool,
			isCrumbVisible: PropTypes.bool,
			pageTitle: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.node,
			]),
			pageDescription: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.node,
			]),
			isBannerVisible: PropTypes.bool,
		}),
		paramProps: PropTypes.object,
		updatedKeys: PropTypes.object,
		redirectPath: PropTypes.string,
		path: PropTypes.string,
		routes: PropTypes.array,
	}),
	extraProps: PropTypes.object,
	component: PropTypes.func || PropTypes.node,
};
const BannerRoute = props => {
	const [updatedData, setUpdatedData] = useState({});
	const routeProps = omit(props, [
		'extraProps',
		'route',
		'component',
	]);
	const {
		extraProps,
		route,
		component: Page,
	} = props;
	const meta = {
		...getRouteMetaConfig(props.route.meta),
		...getUpdatedMeta(props.route.updatedKeys, updatedData),
	};

	return (
		<Route
			{...routeProps}
			render={matchProps => {
				const {
					match,
					history,
					location,
				} = matchProps;
				const paramProps = {};
				const pathName = location.pathname;

				if (route.paramProps) {
					Object.keys(route.paramProps).forEach(key => {
						paramProps[key] = paramReplace(route.paramProps[key], match.params);
					});
				}

				if (route.redirectPath) {
					const { path, redirectPath } = route;

					if (matchPath(location.pathname, { path, exact: true })) {
						return <Redirect to={paramReplace(redirectPath, match.params)}/>;
					}
				}

				function onNavigate(uri, options = { passProps: {} }) {
					history.push({
						pathname: uri,
						passProps: options.passProps,
					});
				}

				function onBack() {
					history.goBack();
				}

				function onUpdate(data) {
					setUpdatedData(data);
				}

				return (
					<Fragment>
						<Breadcrumb.BreadcrumbItem
							to={matchProps.match.url}
							isActive={meta.isCrumbActive}
							isVisible={meta.isCrumbVisible}
						>
							{paramReplace(meta.breadcrumbName, match.params)}
						</Breadcrumb.BreadcrumbItem>
						<HeaderBanner.HeaderBannerItem
							title={paramReplace(meta.pageTitle || meta.breadcrumbName, match.params)}
							description={meta.pageDescription}
							isBannerVisible={meta.isBannerVisible}
						/>
						<Page
							key={pathName}
							{...extraProps}
							{...location.passProps}
							{...paramProps}
							renderedRoutes={renderSwitches(route.routes, extraProps)}
							onNavigate={onNavigate}
							onBack={onBack}
							onUpdate={onUpdate}
							pathName={pathName}
						/>
					</Fragment>
				);
			}}
		/>
	);
};

BannerRoute.propTypes = propTypes;

export default BannerRoute;
