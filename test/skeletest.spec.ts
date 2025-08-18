'use strict';

// Mock the skeletor module
jest.mock('../src/skeletor');
import skeletor from '../src/skeletor';

describe('skeletest tests', () => {
	test('should import skeletor module', () => {
		expect(skeletor).toBeDefined();
		expect(skeletor.run).toBeDefined();
	});

	test('should call skeletor.run when module is imported', () => {
		const mockRun = jest.fn();
		skeletor.run = mockRun;

		// Mock process.argv to avoid Commander.js conflicts
		const originalArgv = process.argv;
		process.argv = ['node', 'skeletest'];

		// Clear the module cache and re-import
		delete require.cache[require.resolve('../src/skeletest')];
		require('../src/skeletest');

		// Restore original argv
		process.argv = originalArgv;

		expect(mockRun).toHaveBeenCalled();
	});
});
