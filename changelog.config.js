const shell = require('shelljs');
const LAST_TAG = shell.exec('git describe --tags `git rev-list --tags --max-count=1`', { silent: true }).toString().trim();

module.exports = {
	gitRawCommitsOpts: {
		from: LAST_TAG,
		merges: true,
	},
	parserOpts: {
		headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
		headerCorrespondence: ['type', 'scope', 'subject'],
		mergePattern: /^Merge pull request #(\d+) from (.*)$/,
		mergeCorrespondence: ['id', 'source'],
	},
	writerOpts: {
		transform: commit => {
			if (!commit.merge) {
				return;
			}

			if (!/^Merge pull request/.test(commit.merge)) {
				return;
			}

			return commit;
		},
		commitPartial: `
*{{#if scope}} **{{scope}}:**
{{~/if}} {{#if subject}}
	{{~subject}}
{{~else}}
	{{~header}}
{{~/if}}

{{~!-- commit link --}} {{#if @root.linkReferences~}}
	([#{{id}}](
	{{~#if @root.repository}}
		{{~#if @root.host}}
			{{~@root.host}}/
		{{~/if}}
		{{~#if @root.owner}}
			{{~@root.owner}}/
		{{~/if}}
		{{~@root.repository}}
	{{~else}}
		{{~@root.repoUrl}}
	{{~/if}}/pull/{{id}}))
{{~else}}
	{{~id}}
{{~/if}}
		`,
	},
};
