#!/usr/bin/env node
'use strict';

import _ from 'lodash';

const isIgnored = (ignores: string[], file: string): boolean => {
	if (_.includes(ignores, file)) return true;
	return !!_.find(ignores, (ignore: string) => _.includes(file, ignore));
};
export default isIgnored;
