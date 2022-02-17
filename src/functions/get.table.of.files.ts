#!/usr/bin/env node
'use strict';

import Table from 'cli-table';

import convertFilesToObjects from './convert.files.to.objects';
import getTableFromFileObjects from './get.table.from.file.objects';

const getTableOfFiles = (files: string[]): Table => {
	const objects = convertFilesToObjects(files);
	return getTableFromFileObjects(objects);
};

export default getTableOfFiles;
