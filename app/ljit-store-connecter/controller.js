import React, { Component } from 'react';

let _store = {
	getState: function () {},
	dispatch: function () {},
	subscribe: function () {},
};
let _connect = defaultConnect;

function defaultMapToProps() {
	return {};
}

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function defaultConnect(
	mapStateToProps = defaultMapToProps,
	mapDispatchToProps = defaultMapToProps,
) {
	return function (WrappedComponent) {
		class ConnectedComponent extends Component {
			constructor(props) {
				super(props);

				this._isMounted = true;
				this.state = {
					stateProps: mapStateToProps(_store.getState()),
				};
				this._handleUpdate = this._handleUpdate.bind(this);
				this._dispatchProps = mapDispatchToProps(_store.dispatch);
			}

			_handleUpdate() {
				if (this._isMounted) {
					this.setState({
						stateProps: mapStateToProps(_store.getState()),
					});
				}
			}

			render() {
				const { stateProps } = this.state;

				return (
					<WrappedComponent
						{...this.props}
						{...stateProps}
						{...this._dispatchProps}
					/>
				);
			}

			componentWillMount() {
				this.unsubscribe = _store.subscribe(this._handleUpdate);
			}

			componentWillUnmount() {
				this._isMounted = false;

				if (typeof this.unsubscribe === 'function') {
					this.unsubscribe();
				}
			}
		}

		ConnectedComponent.displayName = `WithConnected(${getDisplayName(WrappedComponent)})`;

		return ConnectedComponent;
	};
}

export function initController(store = _store, connect = defaultConnect) {
	_store = store;
	_connect = connect;
}
export const connect = _connect;
