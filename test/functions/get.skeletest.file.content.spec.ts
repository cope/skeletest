'use strict';

import getSkeletestFileContent from '../../src/functions/get.skeletest.file.content';

describe('get.skeletest.file.content tests', () => {
	test('should generate Vitest template', () => {
		const result = getSkeletestFileContent(true, 'app.js');
		const expected = `import {describe, test} from 'vitest';

describe('app tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should generate Chai template', () => {
		const result = getSkeletestFileContent(false, 'app.js');
		const expected = `import {expect} from 'chai';

describe('app tests', () => {
	expect(true).to.be.true;
	// TODO: implement tests
	it('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle file with extension', () => {
		const result = getSkeletestFileContent(true, 'utils.helper.js');
		const expected = `import {describe, test} from 'vitest';

describe('utils.helper tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle file without extension', () => {
		const result = getSkeletestFileContent(true, 'config');
		const expected = `import {describe, test} from 'vitest';

describe('config tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should remove test file extension prefix', () => {
		const result = getSkeletestFileContent(true, 'app.spec.js', '.spec');
		const expected = `import {describe, test} from 'vitest';

describe('app tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle different test file prefixes', () => {
		const result = getSkeletestFileContent(false, 'utils.test.ts', '.test');
		const expected = `import {expect} from 'chai';

describe('utils tests', () => {
	expect(true).to.be.true;
	// TODO: implement tests
	it('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle file with path', () => {
		const result = getSkeletestFileContent(true, 'src/utils/helper.js');
		const expected = `import {describe, test} from 'vitest';

describe('helper tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle TypeScript files', () => {
		const result = getSkeletestFileContent(true, 'components/Button.tsx');
		const expected = `import {describe, test} from 'vitest';

describe('Button tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle kebab-case file names', () => {
		const result = getSkeletestFileContent(false, 'file-utils.js');
		const expected = `import {expect} from 'chai';

describe('file-utils tests', () => {
	expect(true).to.be.true;
	// TODO: implement tests
	it('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle camelCase file names', () => {
		const result = getSkeletestFileContent(true, 'fileUtils.js');
		const expected = `import {describe, test} from 'vitest';

describe('fileUtils tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});

	test('should handle empty filename gracefully', () => {
		const result = getSkeletestFileContent(true, '');
		const expected = `import {describe, test} from 'vitest';

describe(' tests', () => {
	// TODO: implement tests
	test.todo('should be implemented');
});
`;
		expect(result).toBe(expected);
	});
});
