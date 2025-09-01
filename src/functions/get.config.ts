#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {set} from 'lodash';
import fixExtension from './fix.extension';

const getDefaultConfig: Function = (): any => {
	return {
		srcFolderName: 'src',
		testFolderName: 'test',
		filesExtensions: ['.ts', '.js'],
		testFileExtensionPrefix: '.test',
		testExtension: 'js',
		ignoreSrcFiles: [],
		ignoreTestFiles: [],
		considerCyTestFiles: false,
		useVitest: false,
		useJest: false,
		ignoreMocksFolder: true
	};
};

const getConfig = (root: string, configFile: string) => {
	const defaultConfig: any = getDefaultConfig();
	try {
		const configPath = path.join(root, configFile);
		const userConfigContent = fs.readFileSync(configPath, 'utf8');
		const userConfig = JSON.parse(userConfigContent);

		const config = {...defaultConfig, ...userConfig};

		// Ensure filesExtensions is an array and properly formatted
		config.filesExtensions = config.filesExtensions.map((ext: string) => fixExtension(ext));

		set(config, 'testFileExtensionPrefix', fixExtension(config.testFileExtensionPrefix));
		set(config, 'testExtension', fixExtension(config.testExtension));

		return config;
	} catch (error) {
		console.error('Error in getConfig:', error);
		// Apply fixExtension to the default config in case of error
		defaultConfig.filesExtensions = defaultConfig.filesExtensions.map((ext: string) => fixExtension(ext));
		set(defaultConfig, 'testFileExtensionPrefix', fixExtension(defaultConfig.testFileExtensionPrefix));
		set(defaultConfig, 'testExtension', fixExtension(defaultConfig.testExtension));
		return defaultConfig;
	}
};
export default getConfig;
