#!/usr/bin/env node
'use strict';

const getTimestamp = (date: Date = new Date()): string => {
	return date //
		.toISOString()
		.replace(/-/, '')
		.replace(/-/, '')
		.replace(/T/, '-')
		.replace(/:/, '')
		.replace(/:/, '')
		.replace(/\..+/, '');
};

export default getTimestamp;
