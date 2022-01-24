#!/usr/bin/env node
'use strict';

const getSkeletestFileContent = (useTestTodo: boolean, fileName: string, testFileExtensionPrefix?: string): string => {
	if (testFileExtensionPrefix) fileName = fileName.replace(testFileExtensionPrefix, '');
	return useTestTodo ? `describe('${fileName} tests', () => it('should be implemented'));` : `describe('${fileName} tests', () => it('should be implemented'));`;
};

export default getSkeletestFileContent;
