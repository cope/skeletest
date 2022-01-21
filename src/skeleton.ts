#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import getConfig from './functions/get.config';

const _checkFolder = (folder: string, name: string): void => {
	if (!fs.existsSync(folder)) {
		console.log(`\nERROR: ${name} folder ${folder} does not exist.`);
		process.exit(1);
	}
	if (!fs.lstatSync(folder).isDirectory()) {
		console.log(`\nERROR: ${name} folder ${folder} is not a directory.`);
		process.exit(1);
	}
};

export default {
	run(commander: any) {
		const options: any = _.pick(commander, ['config', 'report_only']);
		console.log('options', options);

		const root = process.cwd();
		const config = getConfig(root, options?.config);

		const {srcFolderName, srcFilesExtension, testFolderName, testFilesExtension, testFileExtensionPrefix} = config;

		const srcFolder = path.join(root, srcFolderName);
		_checkFolder(srcFolder, 'Source');

		const testFolder = path.join(root, testFolderName);
		_checkFolder(testFolder, 'Test');

		console.log('values', {srcFolder, testFolder});

		console.log('cwd', root);
	}
};
