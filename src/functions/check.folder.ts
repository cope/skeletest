#!/usr/bin/env node
'use strict';

import * as fs from 'fs';

import bail from './bail';

const checkFolder = (folder: string, name: string): void => {
	if (!fs.existsSync(folder)) {
		console.log(`\nERROR: ${name} folder ${folder} does not exist.`);
		bail(2);
	}
	if (!fs.lstatSync(folder).isDirectory()) {
		console.log(`\nERROR: ${name} folder ${folder} is not a directory.`);
		bail(2);
	}
};

export default checkFolder;
