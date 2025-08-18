'use strict';

import checkFolder from '../../src/functions/check.folder';

// Mock the bail function to prevent process.exit
jest.mock('../../src/functions/bail', () => {
	return jest.fn((message: string) => {
		throw new Error(message);
	});
});

describe('check.folder tests', () => {
	it('should pass for existing directory', () => {
		// Should not throw for existing directory
		expect(() => checkFolder('./src', 'test')).not.toThrow();
	});

	it('should throw for non-existent directory', () => {
		expect(() => checkFolder('./nonexistent', 'test')).toThrow();
	});

	it('should throw for file instead of directory', () => {
		expect(() => checkFolder('./package.json', 'test')).toThrow();
	});
});
