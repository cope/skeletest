#!/usr/bin/env node
'use strict';

const {exit} = require('node:process');

const bail = (message?: string): void => {
	console.error(message);
	exit(2);
};
export default bail;
