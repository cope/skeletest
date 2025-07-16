'use strict';

// Mock the exit function at the module level
const mockExit = jest.fn();
jest.mock('node:process', () => ({
	exit: mockExit
}));

import bail from '../../src/functions/bail';

describe('bail tests', () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
		mockExit.mockClear();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it('should print error message and exit with code 2', () => {
		const errorMessage = 'Test error message';

		bail(errorMessage);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockExit).toHaveBeenCalledWith(2);
	});

	it('should handle undefined message', () => {
		bail(undefined);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(undefined);
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockExit).toHaveBeenCalledWith(2);
	});

	it('should handle empty string message', () => {
		bail('');

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith('');
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockExit).toHaveBeenCalledWith(2);
	});

	it('should handle multi-line error messages', () => {
		const multiLineMessage = 'Line 1\nLine 2\nLine 3';

		bail(multiLineMessage);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(multiLineMessage);
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockExit).toHaveBeenCalledWith(2);
	});

	it('should handle long error messages', () => {
		const longMessage = 'This is a very long error message that might be encountered in real-world scenarios and should be handled properly by the bail function';

		bail(longMessage);

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith(longMessage);
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockExit).toHaveBeenCalledWith(2);
	});
});
