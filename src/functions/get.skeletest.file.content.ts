#!/usr/bin/env node
'use strict';

const getSkeletestFileContent = (useTestTodo: boolean, fileName: string): string =>
	useTestTodo ? `describe('${fileName} tests', () => it('should be implemented'));` : `describe('${fileName} tests', () => it('should be implemented'));`;

export default getSkeletestFileContent;
