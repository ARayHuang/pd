import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	List as AntdList,
	Icon as AntdIcon,
} from 'antd';
import cx from 'classnames';
import { OrdersPropTypes } from '../../lib/prop-types-utils';
import './styles.styl';

const propTypes = {
	className: PropTypes.string,
	ordersData: OrdersPropTypes,
	hasPagination: PropTypes.bool,
	renderItems: PropTypes.func,
	onChangeNextPage: PropTypes.func,
};
const DEFAULT_PAGE_SIZE = 20;
const PREFIX_CLASS = 'list-wrap';
const defaultProps = {
	hasPagination: true,
	ordersData: {},
	renderItems: () => {},
	onChangeNextPage: () => {},
};

class List extends Component {
	constructor() {
		super();

		this._renderPagination = this._renderPagination.bind(this);
	}

	_renderPagination() {
		const {
			ordersData,
			hasPagination,
			onChangeNextPage,
		} = this.props;
		const {
			numOfItems,
			numOfPages,
			page,
		} = ordersData;

		if (numOfItems === 0) {
			return null;
		}

		return {
			current: page,
			total: numOfItems,
			onChange: onChangeNextPage,
			pageSize: DEFAULT_PAGE_SIZE,
			itemRender: (page, type, originalElement) => {
				if (type === 'prev') {
					return (
						<div className={`${PREFIX_CLASS}__page-btn-wrapper`}>
							<a onClick={e => {
								e.stopPropagation();
								onChangeNextPage(1);
							}}>
								<AntdIcon type="vertical-right" />
							</a>
							{originalElement}
						</div>
					);
				}

				if (type === 'next') {
					return (
						<div className={`${PREFIX_CLASS}__page-btn-wrapper`}>
							{originalElement}
							<a onClick={e => {
								e.stopPropagation();
								onChangeNextPage(numOfPages);
							}}>
								<AntdIcon type="vertical-left"/>
							</a>
						</div>
					);
				}

				return originalElement;
			},
			className: cx({
				[`${PREFIX_CLASS}__hide-first-page`]: hasPagination && page - 4 >= 0,
				[`${PREFIX_CLASS}__hide-last-page`]: hasPagination && numOfPages - page > 2,
			}),
		};
	}

	render() {
		const {
			ordersData,
			renderItems,
			hasPagination,
		} = this.props;
		const {
			_renderPagination,
		} = this;
		const orders = ordersData.orders.toArray();

		return (
			<AntdList
				itemLayout="vertical"
				dataSource={orders}
				className={PREFIX_CLASS}
				pagination={hasPagination ? _renderPagination() : null}
				renderItem={renderItems}
				locale={{ emptyText: '无任何派单' }}
			/>
		);
	}
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
