#!/usr/bin/env node
'use strict';

const getSkeletestFileContent = (useVitest: boolean, fileName: string, testFileExtensionPrefix?: string): string => {
	console.log('getSkeletestFileContent', useVitest, fileName, testFileExtensionPrefix);
	if (testFileExtensionPrefix) fileName = fileName.replace(testFileExtensionPrefix, '');
	return useVitest //
		? `import {describe, test} from 'vitest';\n\ndescribe('${fileName} tests', () => test.todo('should be implemented'));`
		: `describe('${fileName} tests', () => it('should be implemented'));`;
};
export default getSkeletestFileContent;
