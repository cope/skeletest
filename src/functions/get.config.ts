#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {cloneDeep, find, set} from 'lodash';
import fixExtension from './fix.extension';

const _hasJS = (srcFolder: string) => {
	const files = fs.readdirSync(srcFolder);
	const hasJS = find(files, (file) => {
		const ext = path.extname(file);
		return ext === '.js';
	});
	return !!hasJS;
};

const _getDefaultConfig = (root: string) => {
	const defaultConfig = {
		srcFolderName: 'src',
		testFolderName: 'test',
		filesExtension: '.ts',
		testFileExtensionPrefix: '.spec',
		ignoreSrcFiles: [],
		ignoreTestFiles: [],
		considerVueFiles: false,
		considerCyTestFiles: false,
		useVitest: false,
		includeJsonFiles: false
	};

	try {
		let config = cloneDeep(defaultConfig);

		const srcFolder = path.join(root, 'src');
		if (fs.lstatSync(srcFolder).isDirectory()) {
			if (_hasJS(srcFolder)) {
				set(config, 'filesExtension', '.js');
				set(config, 'testFileExtensionPrefix', '.test');
			}
		}

		return config;
	} catch (error) {
		return defaultConfig;
	}
};

const getConfig = (root: string, configFile: string) => {
	const defaultConfig = _getDefaultConfig(root);
	try {
		const userConfig = require(path.join(root, configFile));

		const config = {...defaultConfig, ...userConfig};
		set(config, 'filesExtension', fixExtension(config.filesExtension));
		set(config, 'testFileExtensionPrefix', fixExtension(config.testFileExtensionPrefix));

		return config;
	} catch (error) {
		return defaultConfig;
	}
};
export default getConfig;
