#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';

const convertFilesToObjects = (files: string[]): any[] => {
	return _.map(files, (f) => {
		const parts = _.split(f, '\\');
		const name = parts.pop();
		const path = _.join(parts, '\\');
		const full = path + '\\' + name;
		return {name, path, full};
	});
};

export default convertFilesToObjects;
