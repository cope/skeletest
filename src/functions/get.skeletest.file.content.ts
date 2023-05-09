#!/usr/bin/env node
'use strict';

import * as path from 'path';

const getSkeletestFileContent = (useVitest: boolean, fileName: string, testFileExtensionPrefix?: string): string => {
	if (testFileExtensionPrefix) fileName = fileName.replace(testFileExtensionPrefix, '');
	fileName = path.parse(fileName).name;
	return useVitest //
		? `import {describe, test} from 'vitest';\n\ndescribe('${fileName} tests', () => {\n\texpect(true).to.be.true;\n\tit('should be implemented');\n});\n`
		: `import {expect} from 'chai';\n\ndescribe('${fileName} tests', () => {\n\texpect(true).to.be.true;\n\tit('should be implemented');\n});\n`;
};
export default getSkeletestFileContent;
