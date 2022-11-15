#!/usr/bin/env node
'use strict';

import * as path from 'path';

const getSkeletestFileContent = (useVitest: boolean, fileName: string, testFileExtensionPrefix?: string): string => {
	if (testFileExtensionPrefix) fileName = fileName.replace(testFileExtensionPrefix, '');
	fileName = path.parse(fileName).name;
	return useVitest //
		? `import {describe, test} from 'vitest';\n\ndescribe('${fileName} tests', () => test.todo('should be implemented'));`
		: `describe('${fileName} tests', () => it('should be implemented'));`;
};
export default getSkeletestFileContent;
