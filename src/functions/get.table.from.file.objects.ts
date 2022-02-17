#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import Table from 'cli-table';

const getTableFromFileObjects = (objects: string[], includeNewPath?: boolean): Table => {
	let columns = ['#', 'File', 'Path'];
	if (includeNewPath) columns.push('New Path');

	const table = new Table({style: {head: ['black'], compact: true}, head: columns});
	let id = 0;
	_.each(objects, (o: any) => table.push([++id, ..._.values(_.omit(o, ['full']))]));
	return table;
};

export default getTableFromFileObjects;
