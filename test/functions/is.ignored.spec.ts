'use strict';

import isIgnored from '../../src/functions/is.ignored';

describe('is.ignored tests', () => {
	test('should return true for exact match', () => {
		const ignores = ['test.txt', 'config.json', 'README.md'];
		const result = isIgnored(ignores, 'test.txt');
		expect(result).toBe(true);
	});

	test('should return true for partial match', () => {
		const ignores = ['node_modules', '.git', 'tmp'];
		const result = isIgnored(ignores, 'src/node_modules/package.json');
		expect(result).toBe(true);
	});

	test('should return false when no match found', () => {
		const ignores = ['test.txt', 'config.json'];
		const result = isIgnored(ignores, 'app.js');
		expect(result).toBe(false);
	});

	test('should return false for empty ignore array', () => {
		const ignores: string[] = [];
		const result = isIgnored(ignores, 'any-file.txt');
		expect(result).toBe(false);
	});

	test('should handle empty file name', () => {
		const ignores = ['test.txt', 'config.json'];
		const result = isIgnored(ignores, '');
		expect(result).toBe(false);
	});

	test('should handle empty string in ignore patterns', () => {
		const ignores = ['', 'test.txt'];
		const result = isIgnored(ignores, '');
		expect(result).toBe(true);
	});

	test('should match file extensions', () => {
		const ignores = ['.log', '.tmp', '.cache'];
		const result = isIgnored(ignores, 'error.log');
		expect(result).toBe(true);
	});

	test('should match directory patterns', () => {
		const ignores = ['dist/', 'build/', 'coverage/'];
		const result = isIgnored(ignores, 'dist/index.js');
		expect(result).toBe(true);
	});

	test('should be case sensitive', () => {
		const ignores = ['Test.txt'];
		const result = isIgnored(ignores, 'test.txt');
		expect(result).toBe(false);
	});

	test('should handle multiple matching patterns', () => {
		const ignores = ['node_modules', 'test'];
		const result = isIgnored(ignores, 'node_modules/test/file.js');
		expect(result).toBe(true);
	});

	test('should handle complex file paths', () => {
		const ignores = ['__pycache__', '.git', 'node_modules'];
		const testFiles = ['src/__pycache__/file.pyc', 'project/.git/config', 'app/node_modules/package.json', 'src/main.py'];

		expect(isIgnored(ignores, testFiles[0])).toBe(true);
		expect(isIgnored(ignores, testFiles[1])).toBe(true);
		expect(isIgnored(ignores, testFiles[2])).toBe(true);
		expect(isIgnored(ignores, testFiles[3])).toBe(false);
	});
});
