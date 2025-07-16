'use strict';

import fixExtension from '../../src/functions/fix.extension';

describe('fix.extension tests', () => {
	it('should add dot prefix to extension without dot', () => {
		const result = fixExtension('ts');
		expect(result).toBe('.ts');
	});

	it('should preserve dot prefix when already present', () => {
		const result = fixExtension('.ts');
		expect(result).toBe('.ts');
	});

	it('should convert extension to lowercase', () => {
		const result = fixExtension('TS');
		expect(result).toBe('.ts');
	});

	it('should handle extension with dot and convert to lowercase', () => {
		const result = fixExtension('.TS');
		expect(result).toBe('.ts');
	});

	it('should handle mixed case extensions', () => {
		const result = fixExtension('JavaScript');
		expect(result).toBe('.javascript');
	});

	it('should handle mixed case extensions with dot', () => {
		const result = fixExtension('.JavaScript');
		expect(result).toBe('.javascript');
	});

	it('should handle empty string', () => {
		const result = fixExtension('');
		expect(result).toBe('.');
	});

	it('should handle single character extensions', () => {
		const result = fixExtension('c');
		expect(result).toBe('.c');
	});

	it('should handle single character extensions with dot', () => {
		const result = fixExtension('.c');
		expect(result).toBe('.c');
	});

	it('should handle common file extensions', () => {
		expect(fixExtension('js')).toBe('.js');
		expect(fixExtension('ts')).toBe('.ts');
		expect(fixExtension('json')).toBe('.json');
		expect(fixExtension('md')).toBe('.md');
		expect(fixExtension('html')).toBe('.html');
		expect(fixExtension('css')).toBe('.css');
	});

	it('should handle extensions with numbers', () => {
		expect(fixExtension('py3')).toBe('.py3');
		expect(fixExtension('.py3')).toBe('.py3');
		expect(fixExtension('PY3')).toBe('.py3');
	});

	it('should handle long extensions', () => {
		const longExt = 'verylongextension';
		expect(fixExtension(longExt)).toBe('.verylongextension');
		expect(fixExtension('.' + longExt)).toBe('.verylongextension');
	});

	it('should handle extensions with special characters', () => {
		expect(fixExtension('spec')).toBe('.spec');
		expect(fixExtension('test')).toBe('.test');
		expect(fixExtension('config')).toBe('.config');
	});

	it('should handle uppercase extensions consistently', () => {
		expect(fixExtension('JS')).toBe('.js');
		expect(fixExtension('.JS')).toBe('.js');
		expect(fixExtension('JSON')).toBe('.json');
		expect(fixExtension('.JSON')).toBe('.json');
	});
});
