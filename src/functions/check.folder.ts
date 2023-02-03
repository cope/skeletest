#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import bail from './bail';

const clc = require('cli-color');

const checkFolder = (folder: string, type: string): void => {
	if (!fs.existsSync(folder)) {
		bail(clc.red(`\nERROR: ${type} folder ` + clc.bold(`${folder}`) + ' does not exist.'));
	}
	if (!fs.lstatSync(folder).isDirectory()) {
		bail(clc.red(`\nERROR: ${type} folder ` + clc.bold(`${folder}`) + ' is not a directory.'));
	}
};

export default checkFolder;
