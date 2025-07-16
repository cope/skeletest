'use strict';

import getTableOfFiles from '../../src/functions/get.table.of.files';

describe('get.table.of.files tests', () => {
	test('should create table from file paths', () => {
		const files = ['src/app.js', 'test/app.spec.js', 'package.json'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		const tableString = result.toString();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('app.spec.js');
		expect(tableString).toContain('package.json');
		expect(tableString).toContain('src');
		expect(tableString).toContain('test');
	});

	test('should handle empty files array', () => {
		const files: string[] = [];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(0);

		const tableString = result.toString();
		expect(tableString).toBeDefined();
	});

	test('should handle files in root directory', () => {
		const files = ['index.js', 'README.md'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(2);

		const tableString = result.toString();
		expect(tableString).toContain('index.js');
		expect(tableString).toContain('README.md');
		expect(tableString).toContain('1');
		expect(tableString).toContain('2');
	});

	test('should handle nested directory paths', () => {
		const files = ['src/utils/helpers/format.js', 'test/unit/utils/format.spec.js'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(2);

		const tableString = result.toString();
		expect(tableString).toContain('format.js');
		expect(tableString).toContain('format.spec.js');
		expect(tableString).toContain('src/utils/helpers');
		expect(tableString).toContain('test/unit/utils');
	});

	test('should handle files with various extensions', () => {
		const files = ['src/app.ts', 'test/app.test.tsx', 'config.json', 'README.md'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(4);

		const tableString = result.toString();
		expect(tableString).toContain('app.ts');
		expect(tableString).toContain('app.test.tsx');
		expect(tableString).toContain('config.json');
		expect(tableString).toContain('README.md');
	});

	test('should handle files without extensions', () => {
		const files = ['src/config', 'bin/cli', 'LICENSE'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		const tableString = result.toString();
		expect(tableString).toContain('config');
		expect(tableString).toContain('cli');
		expect(tableString).toContain('LICENSE');
	});

	test('should include sequential row numbers', () => {
		const files = ['file1.js', 'file2.js', 'file3.js'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		const tableString = result.toString();
		expect(tableString).toContain('1');
		expect(tableString).toContain('2');
		expect(tableString).toContain('3');
	});

	test('should handle single file', () => {
		const files = ['app.js'];
		const result = getTableOfFiles(files);

		expect(result).toBeDefined();
		expect(result.length).toBe(1);

		const tableString = result.toString();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('1');
	});
});
