'use strict';

import getTableFromFileObjects from '../../src/functions/get.table.from.file.objects';

describe('get.table.from.file.objects tests', () => {
	test('should create table from file objects', () => {
		const objects = [
			{name: 'app.js', path: 'src', full: 'src/app.js'},
			{name: 'test.js', path: 'test', full: 'test/test.js'}
		];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(2);

		const tableString = result.toString();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('test.js');
		expect(tableString).toContain('src');
		expect(tableString).toContain('test');
	});

	test('should create table with includeNewPath flag', () => {
		const objects = [{name: 'app.js', path: 'src', full: 'src/app.js', newPath: 'dist'}];
		const result = getTableFromFileObjects(objects, true);

		expect(result).toBeDefined();
		expect(result.length).toBe(1);

		const tableString = result.toString();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('src');
		expect(tableString).toContain('dist');
	});

	test('should handle empty objects array', () => {
		const objects: any[] = [];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(0);

		const tableString = result.toString();
		expect(tableString).toBeDefined();
	});

	test('should replace empty name with asterisk', () => {
		const objects = [
			{name: '', path: 'src', full: 'src/'},
			{name: 'app.js', path: 'src', full: 'src/app.js'}
		];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(2);

		// Check that the table contains the transformed data
		const tableString = result.toString();
		expect(tableString).toContain('*');
		expect(tableString).toContain('app.js');
	});

	test('should add sequential row numbers', () => {
		const objects = [
			{name: 'file1.js', path: 'src', full: 'src/file1.js'},
			{name: 'file2.js', path: 'src', full: 'src/file2.js'},
			{name: 'file3.js', path: 'src', full: 'src/file3.js'}
		];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		// Check that the table contains numbered rows
		const tableString = result.toString();
		expect(tableString).toContain('1');
		expect(tableString).toContain('2');
		expect(tableString).toContain('3');
	});

	test('should omit full property from table data', () => {
		const objects = [{name: 'app.js', path: 'src', full: 'src/app.js', other: 'data'}];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(1);

		// The full property should not appear in the table
		const tableString = result.toString();
		expect(tableString).not.toContain('src/app.js');
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('src');
		expect(tableString).toContain('data');
	});

	test('should handle objects with additional properties', () => {
		const objects = [{name: 'app.js', path: 'src', full: 'src/app.js', newPath: 'dist', size: '1KB'}];
		const result = getTableFromFileObjects(objects, true);

		expect(result).toBeDefined();
		expect(result.length).toBe(1);

		const tableString = result.toString();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('src');
		expect(tableString).toContain('dist');
		expect(tableString).toContain('1KB');
	});

	test('should not mutate original objects', () => {
		const objects = [
			{name: '', path: 'src', full: 'src/'},
			{name: 'app.js', path: 'test', full: 'test/app.js'}
		];
		const originalObjects = JSON.parse(JSON.stringify(objects));

		getTableFromFileObjects(objects);

		// Original objects should remain unchanged
		expect(objects).toEqual(originalObjects);
		expect(objects[0].name).toBe('');
	});

	test('should handle objects with missing names', () => {
		const objects = [
			{name: '', path: 'src', full: 'src/'},
			{name: 'app.js', path: 'test', full: 'test/app.js'}
		];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(2);

		// Should handle empty names gracefully by replacing with asterisk
		const tableString = result.toString();
		expect(tableString).toBeDefined();
		expect(tableString).toContain('*');
		expect(tableString).toContain('app.js');
	});

	test('should handle null objects in array', () => {
		const objects = [
			{name: 'app.js', path: 'src', full: 'src/app.js'},
			null, // This should trigger the if (!o) return null line
			{name: 'test.js', path: 'test', full: 'test/test.js'}
		];
		const result = getTableFromFileObjects(objects);

		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		// Should handle null objects gracefully
		const tableString = result.toString();
		expect(tableString).toBeDefined();
		expect(tableString).toContain('app.js');
		expect(tableString).toContain('test.js');
	});
});
