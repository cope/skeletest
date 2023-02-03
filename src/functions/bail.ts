#!/usr/bin/env node
'use strict';

const {exit} = require('node:process');

const clc = require('cli-color');

const bail = (message?: string): void => {
	console.log(clc.red(message));
	exit(2);
};
export default bail;
