import React, { useRef, useEffect } from 'react';
import * as loadable from 'react-loadable';
import { Loading } from 'ljit-react-components';

export function loadComponent(options) {
	return loadable(Object.assign({
		loading: LoadingWrapper,
	}, options));
}

function LoadingWrapper(prop) {
	const { error } = prop;

	if (process.env.NODE_ENV !== 'production' && error) {
		console.error(error);
	}

	return <Loading />;
}

export function usePrevious(value) {
	const ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
}
