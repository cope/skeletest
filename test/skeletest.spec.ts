'use strict';

jest.mock('../src/skeletor');
jest.mock('commander', () => {
	const command: any = {};
	['version', 'description', 'option', 'parse'].forEach((method: string) => (command[method] = jest.fn(() => command)));
	command.opts = jest.fn(() => ({fix: false}));
	return {Command: jest.fn(() => command)};
});
import skeletor from '../src/skeletor';

describe('skeletest tests', () => {
	test('should import skeletor module', () => {
		expect(skeletor).toBeDefined();
		expect(skeletor.run).toBeDefined();
	});

	test('should call skeletor.run when module is imported', () => {
		const mockRun = jest.fn();
		skeletor.run = mockRun;

		delete require.cache[require.resolve('../src/skeletest')];
		require('../src/skeletest');

		expect(mockRun).toHaveBeenCalledWith({fix: false});
	});
});
