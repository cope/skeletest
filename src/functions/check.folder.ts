#!/usr/bin/env node
'use strict';

import * as fs from 'fs';

const checkFolder = (folder: string, name: string): void => {
	if (!fs.existsSync(folder)) {
		console.log(`\nERROR: ${name} folder ${folder} does not exist.`);
		process.exit(1);
	}
	if (!fs.lstatSync(folder).isDirectory()) {
		console.log(`\nERROR: ${name} folder ${folder} is not a directory.`);
		process.exit(1);
	}
};

export default checkFolder;
