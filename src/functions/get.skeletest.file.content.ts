#!/usr/bin/env node
'use strict';

import * as path from 'path';

interface SkeletestOptions {
	useVitest?: boolean;
	useJest?: boolean;
	testFileExtensionPrefix?: string;
}

const getSkeletestFileContent = (options: SkeletestOptions, fileName: string): string => {
	const {useVitest = false, useJest = false, testFileExtensionPrefix} = options;

	if (testFileExtensionPrefix) fileName = fileName.replace(testFileExtensionPrefix, '');
	fileName = path.parse(fileName).name;

	if (useJest) {
		return `'use strict';\n\ndescribe('${fileName} tests', () => {\n\tit.todo('should be implemented');\n});\n`;
	} else if (useVitest) {
		return `import {describe, test} from 'vitest';\n\ndescribe('${fileName} tests', () => {\n\t// TODO: implement tests\n\ttest.todo('should be implemented');\n});\n`;
	} else {
		return `import {expect} from 'chai';\n\ndescribe('${fileName} tests', () => {\n\texpect(true).to.be.true;\n\t// TODO: implement tests\n\tit('should be implemented');\n});\n`;
	}
};
export default getSkeletestFileContent;
