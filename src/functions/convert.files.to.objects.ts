#!/usr/bin/env node
'use strict';

import * as os from 'node:os';

import * as _ from 'lodash';

const convertFilesToObjects = (files: string[]): any[] => {
	const platform = os.platform();
	const separator = 'win32' === platform ? '\\' : '/';

	return _.map(files, (f) => {
		const parts = _.split(f, separator);
		const name = parts.pop();
		const path = _.join(parts, separator);
		const full = path + separator + name;
		return {name, path, full};
	});
};

export default convertFilesToObjects;
