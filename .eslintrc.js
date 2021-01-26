module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: [
		'xo',
		'plugin:react/recommended',
	],
	globals: {
		jest: 'readonly',
		describe: 'readonly',
		test: 'readonly',
		expect: 'readonly',
		beforeEach: 'readonly',
		afterEach: 'readonly',
		beforeAll: 'readonly',
		afterAll: 'readonly',
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
	},
	plugins: [
		'react',
		'react-hooks',
	],
	settings: {
		react: {
			version: '15.6',
		},
	},
	rules: {
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: 'multiline-block-like',
				next: '*',
			},
			{
				blankLine: 'always',
				prev: '*',
				next: [
					'block',
					'block-like',
					'cjs-export',
					'class',
					'const',
					'export',
					'import',
					'let',
					'var',
				],
			},
			{
				blankLine: 'always',
				prev: [
					'block',
					'block-like',
					'cjs-export',
					'class',
					'const',
					'export',
					'import',
					'let',
					'var',
				],
				next: '*',
			},
			{
				blankLine: 'never',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var'],
			},
			{
				blankLine: 'any',
				prev: ['export', 'import'],
				next: ['export', 'import'],
			},
		],
		'comma-dangle': ['error', 'always-multiline'],
		'object-curly-spacing': ['error', 'always'],
		'valid-jsdoc': ['error', { requireParamDescription: false, requireReturnDescription: false }],
		'default-param-last': 'off',
		'no-warning-comments': [0, { terms: ['fixme', 'xxx'], location: 'start' }],
		'new-cap': [2, { capIsNewExceptions: ['Map', 'List'] }],
		complexity: ['warn', { max: 100 }],
	},
};
