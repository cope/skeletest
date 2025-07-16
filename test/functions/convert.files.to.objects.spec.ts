#!/usr/bin/env node
'use strict';

// Mock the os module at the top level
jest.mock('node:os', () => ({
	...jest.requireActual('node:os'),
	platform: jest.fn(() => 'win32') // Default to Windows for most tests
}));

import convertFilesToObjects from '../../src/functions/convert.files.to.objects';
import * as os from 'node:os';

describe('convert.files.to.objects tests', () => {
	afterEach(() => {
		// Reset the mock to Windows after each test
		(os.platform as jest.Mock).mockReturnValue('win32');
	});

	test('should convert file paths to objects', () => {
		const files = ['src/app.js', 'test/app.spec.js', 'package.json'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(3);
		// On Windows, the function uses backslashes, but input uses forward slashes
		expect(result[0]).toEqual({
			name: 'src/app.js',
			path: '',
			full: '\\src/app.js'
		});
		expect(result[1]).toEqual({
			name: 'test/app.spec.js',
			path: '',
			full: '\\test/app.spec.js'
		});
		expect(result[2]).toEqual({
			name: 'package.json',
			path: '',
			full: '\\package.json'
		});
	});

	test('should handle empty array', () => {
		const files: string[] = [];
		const result = convertFilesToObjects(files);
		expect(result).toEqual([]);
	});

	test('should handle files in root directory', () => {
		const files = ['index.js', 'README.md'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'index.js',
			path: '',
			full: '\\index.js'
		});
		expect(result[1]).toEqual({
			name: 'README.md',
			path: '',
			full: '\\README.md'
		});
	});

	test('should handle nested directory paths', () => {
		const files = ['src/utils/helpers/format.js', 'test/unit/utils/format.spec.js'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'src/utils/helpers/format.js',
			path: '',
			full: '\\src/utils/helpers/format.js'
		});
		expect(result[1]).toEqual({
			name: 'test/unit/utils/format.spec.js',
			path: '',
			full: '\\test/unit/utils/format.spec.js'
		});
	});

	test('should handle files without extensions', () => {
		const files = ['src/config', 'bin/cli'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'src/config',
			path: '',
			full: '\\src/config'
		});
		expect(result[1]).toEqual({
			name: 'bin/cli',
			path: '',
			full: '\\bin/cli'
		});
	});

	test('should handle Windows-style backslash paths', () => {
		const windowsFiles = ['src\\app.js', 'test\\app.spec.js'];
		const result = convertFilesToObjects(windowsFiles);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'app.js',
			path: 'src',
			full: 'src\\app.js'
		});
		expect(result[1]).toEqual({
			name: 'app.spec.js',
			path: 'test',
			full: 'test\\app.spec.js'
		});
	});

	test('should handle files with dots in directory names', () => {
		const files = ['src/.config/settings.json', 'test/.fixtures/data.json'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'src/.config/settings.json',
			path: '',
			full: '\\src/.config/settings.json'
		});
		expect(result[1]).toEqual({
			name: 'test/.fixtures/data.json',
			path: '',
			full: '\\test/.fixtures/data.json'
		});
	});

	test('should handle files with multiple dots in names', () => {
		const files = ['src/app.min.js', 'test/app.spec.min.js'];
		const result = convertFilesToObjects(files);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			name: 'src/app.min.js',
			path: '',
			full: '\\src/app.min.js'
		});
		expect(result[1]).toEqual({
			name: 'test/app.spec.min.js',
			path: '',
			full: '\\test/app.spec.min.js'
		});
	});

	test('should use forward slashes for non-Windows platforms', () => {
		// Change the mock for this specific test
		(os.platform as jest.Mock).mockReturnValue('linux');

		const files = ['src/app.js'];
		const result = convertFilesToObjects(files);

		expect(result[0]).toEqual({
			name: 'app.js',
			path: 'src',
			full: 'src/app.js'
		});

		// Reset back to Windows for other tests
		(os.platform as jest.Mock).mockReturnValue('win32');
	});
});
