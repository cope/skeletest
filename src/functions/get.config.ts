#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {cloneDeep, find, set} from 'lodash';
import fixExtension from './fix.extension';

const hasJS = (srcFolder: string) => {
	const files = fs.readdirSync(srcFolder);
	const foundJS = find(files, (file) => {
		const ext = path.extname(file);
		return ext === '.js';
	});
	return !!foundJS;
};

const getDefaultConfig = (root: string) => {
	const defaultConfig = {
		srcFolderName: 'src',
		testFolderName: 'test',
		filesExtensions: ['.ts', '.js'],
		testFileExtensionPrefix: '.spec',
		ignoreSrcFiles: [],
		ignoreTestFiles: [],
		considerVueFiles: false,
		considerCyTestFiles: false,
		useVitest: false,
		includeJsonFiles: false,
		ignoreMocksFolder: true
	};

	try {
		const config = cloneDeep(defaultConfig);

		const srcFolder = path.join(root, 'src');
		if (fs.lstatSync(srcFolder).isDirectory()) {
			if (hasJS(srcFolder)) {
				// Keep both extensions but prioritize JS if detected
				set(config, 'filesExtensions', ['.js', '.ts']);
				set(config, 'testFileExtensionPrefix', '.test');
			}
		}

		return config;
	} catch (error) {
		console.error('Error in getDefaultConfig:', error);
		return defaultConfig;
	}
};

const getConfig = (root: string, configFile: string) => {
	const defaultConfig = getDefaultConfig(root);
	try {
		const userConfig = require(path.join(root, configFile));

		const config = {...defaultConfig, ...userConfig};

		// Ensure filesExtensions is an array and properly formatted
		config.filesExtensions = config.filesExtensions.map((ext: string) => fixExtension(ext));

		set(config, 'testFileExtensionPrefix', fixExtension(config.testFileExtensionPrefix));

		return config;
	} catch (error) {
		console.error('Error in getConfig:', error);
		return defaultConfig;
	}
};
export default getConfig;
