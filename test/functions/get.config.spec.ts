'use strict';

import getConfig from '../../src/functions/get.config';
import * as fs from 'fs';
import * as path from 'path';

describe('get.config tests', () => {
	const testRoot = process.cwd();
	const mockConfigPath = path.join(testRoot, '.skeletest.test-config.json');

	beforeEach(() => {
		// Clean up any existing test config file
		if (fs.existsSync(mockConfigPath)) {
			fs.unlinkSync(mockConfigPath);
		}
		// Clear the require cache to ensure fresh config loading
		delete require.cache[mockConfigPath];
	});

	afterEach(() => {
		// Clean up test config file
		if (fs.existsSync(mockConfigPath)) {
			fs.unlinkSync(mockConfigPath);
		}
		// Clear the require cache
		delete require.cache[mockConfigPath];
	});

	test('should return default config when no config file exists', () => {
		const result = getConfig(testRoot, '.non-existent-config.json');

		expect(result).toHaveProperty('srcFolderName', 'src');
		expect(result).toHaveProperty('testFolderName', 'test');
		expect(result).toHaveProperty('filesExtensions');
		expect(result).toHaveProperty('testFileExtensionPrefix', '.test');
		expect(result).toHaveProperty('testExtension', '.js');
		expect(result).toHaveProperty('considerCyTestFiles', false);
		expect(result).toHaveProperty('useVitest', false);
		expect(result).toHaveProperty('ignoreMocksFolder', true);
		expect(result).toHaveProperty('ignoreSrcFiles');
		expect(result).toHaveProperty('ignoreTestFiles');
		expect(Array.isArray(result.filesExtensions)).toBe(true);
		expect(Array.isArray(result.ignoreSrcFiles)).toBe(true);
		expect(Array.isArray(result.ignoreTestFiles)).toBe(true);
	});

	test('should properly format extensions in default config', () => {
		const result = getConfig(testRoot, '.non-existent-config.json');

		// All extensions should start with dot
		result.filesExtensions.forEach((ext: string) => {
			expect(ext).toMatch(/^\./);
		});

		expect(result.testFileExtensionPrefix).toMatch(/^\./);
		expect(result.testExtension).toMatch(/^\./);
	});

	test('should merge user config with default config', () => {
		const userConfig = {
			srcFolderName: 'source',
			testFolderName: 'tests',
			filesExtensions: ['js', 'ts'],
			testFileExtensionPrefix: 'test',
			testExtension: 'js',
			useVitest: true,
			ignoreSrcFiles: ['ignore.ts'],
			ignoreTestFiles: ['ignore.test.ts']
		};

		fs.writeFileSync(mockConfigPath, JSON.stringify(userConfig, null, 2));

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		expect(result.srcFolderName).toBe('source');
		expect(result.testFolderName).toBe('tests');
		expect(result.filesExtensions).toEqual(['.js', '.ts']);
		expect(result.testFileExtensionPrefix).toBe('.test');
		expect(result.testExtension).toBe('.js');
		expect(result.useVitest).toBe(true);
		expect(result.ignoreSrcFiles).toEqual(['ignore.ts']);
		expect(result.ignoreTestFiles).toEqual(['ignore.test.ts']);

		// Should preserve defaults not specified in user config
		expect(result.considerCyTestFiles).toBe(false);
		expect(result.ignoreMocksFolder).toBe(true);
	});

	test('should handle user config with multiple file extensions', () => {
		const userConfig = {
			filesExtensions: ['js', 'ts', 'vue', 'json'],
			testFileExtensionPrefix: 'test',
			testExtension: 'js'
		};

		fs.writeFileSync(mockConfigPath, JSON.stringify(userConfig, null, 2));

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		expect(result.filesExtensions).toEqual(['.js', '.ts', '.vue', '.json']);
		expect(result.testFileExtensionPrefix).toBe('.test');
		expect(result.testExtension).toBe('.js');
	});

	test('should handle extensions with and without dots', () => {
		const userConfig = {
			filesExtensions: ['.js', 'ts', '.vue', 'json'],
			testFileExtensionPrefix: '.test',
			testExtension: 'js'
		};

		fs.writeFileSync(mockConfigPath, JSON.stringify(userConfig, null, 2));

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		expect(result.filesExtensions).toEqual(['.js', '.ts', '.vue', '.json']);
		expect(result.testFileExtensionPrefix).toBe('.test');
		expect(result.testExtension).toBe('.js');
	});

	test('should handle empty extensions gracefully', () => {
		const userConfig = {
			filesExtensions: ['', 'js', 'ts'],
			testFileExtensionPrefix: '',
			testExtension: ''
		};

		fs.writeFileSync(mockConfigPath, JSON.stringify(userConfig, null, 2));

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		expect(result.filesExtensions).toEqual(['.', '.js', '.ts']);
		expect(result.testFileExtensionPrefix).toBe('.');
		expect(result.testExtension).toBe('.');
	});

	test('should handle case sensitivity in extensions', () => {
		const userConfig = {
			filesExtensions: ['JS', 'TS', 'VUE'],
			testFileExtensionPrefix: 'TEST',
			testExtension: 'JS'
		};

		fs.writeFileSync(mockConfigPath, JSON.stringify(userConfig, null, 2));

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		expect(result.filesExtensions).toEqual(['.js', '.ts', '.vue']);
		expect(result.testFileExtensionPrefix).toBe('.test');
		expect(result.testExtension).toBe('.js');
	});

	test('should handle malformed JSON gracefully', () => {
		fs.writeFileSync(mockConfigPath, '{ invalid json }');

		const result = getConfig(testRoot, '.skeletest.test-config.json');

		// Should return default config when JSON is malformed
		expect(result).toHaveProperty('srcFolderName', 'src');
		expect(result).toHaveProperty('testFolderName', 'test');
		expect(result).toHaveProperty('testFileExtensionPrefix', '.test');
		expect(result).toHaveProperty('testExtension', '.js');
	});
});
