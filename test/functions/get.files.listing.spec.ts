'use strict';

import getFilesListing from '../../src/functions/get.files.listing';

describe('get.files.listing tests', () => {
	it('should find TypeScript files in test directory', () => {
		const result = getFilesListing('./test', '.ts');

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((file: string) => file.endsWith('.ts'))).toBe(true);
	});

	it('should find multiple file types', () => {
		const result = getFilesListing('./src', ['.ts', '.js']);

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((file: string) => file.endsWith('.ts') || file.endsWith('.js'))).toBe(true);
	});

	it('should handle single extension as string', () => {
		const result = getFilesListing('./src', 'ts');

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((file: string) => file.endsWith('.ts'))).toBe(true);
	});

	it('should return sorted results', () => {
		const result = getFilesListing('./test', '.ts');

		if (result.length > 1) {
			for (let i = 1; i < result.length; i++) {
				expect(result[i] >= result[i - 1]).toBe(true);
			}
		}
	});

	it('should return empty array for non-existent extension', () => {
		const result = getFilesListing('./src', '.nonexistent');

		expect(result).toEqual([]);
	});

	it('should find files with additional extensions', () => {
		const result = getFilesListing('./src', '.ts', ['.js']);

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((file: string) => file.endsWith('.ts') || file.endsWith('.js'))).toBe(true);
	});
});
