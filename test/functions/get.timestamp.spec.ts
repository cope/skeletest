'use strict';

import getTimestamp from '../../src/functions/get.timestamp';

describe('get.timestamp tests', () => {
	test('should format date to timestamp string', () => {
		const testDate = new Date('2023-12-25T14:30:45.123Z');
		const result = getTimestamp(testDate);
		expect(result).toBe('20231225-143045');
	});

	test('should handle different date formats', () => {
		const testDate = new Date('2024-01-01T09:05:30.999Z');
		const result = getTimestamp(testDate);
		expect(result).toBe('20240101-090530');
	});

	test('should handle date with single digit month and day', () => {
		const testDate = new Date('2023-03-05T08:07:06.000Z');
		const result = getTimestamp(testDate);
		expect(result).toBe('20230305-080706');
	});

	test('should use current date when no parameter provided', () => {
		const result = getTimestamp();
		expect(result).toMatch(/^\d{8}-\d{6}$/);
		expect(result).toHaveLength(15);
	});

	test('should handle edge case dates', () => {
		const newYear = new Date('2023-01-01T00:00:00.000Z');
		const result = getTimestamp(newYear);
		expect(result).toBe('20230101-000000');
	});

	test('should handle leap year date', () => {
		const leapYear = new Date('2024-02-29T23:59:59.999Z');
		const result = getTimestamp(leapYear);
		expect(result).toBe('20240229-235959');
	});

	test('should always return string of consistent format', () => {
		const dates = [new Date('2020-12-31T23:59:59.999Z'), new Date('2021-01-01T00:00:00.000Z'), new Date('2022-06-15T12:30:45.500Z')];

		dates.forEach((date) => {
			const result = getTimestamp(date);
			expect(result).toMatch(/^\d{8}-\d{6}$/);
			expect(result).toHaveLength(15);
		});
	});
});
