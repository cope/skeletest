#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';
import {cloneDeep, find, set} from 'lodash';

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
		filesExtension: 'ts',
		testFolderName: 'test',
		testFileExtensionPrefix: 'spec'
	};

	try {
		const config = cloneDeep(defaultConfig);

		const srcFolder = path.join(root, 'src');
		if (fs.lstatSync(srcFolder).isDirectory()) {
			if (_hasJS(srcFolder)) {
				set(config, 'filesExtension', 'js');
				set(config, 'testFileExtensionPrefix', 'test');
			}
		}

		return config;
	} catch (error) {
		return defaultConfig;
	}
};

const getConfig = (root: string, configFile: string) => {
	try {
		return require(path.join(root, configFile));
	} catch (error) {
		return _getDefaultConfig(root);
	}
};

export default getConfig;
