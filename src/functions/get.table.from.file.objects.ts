#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import Table from 'cli-table';

const getTableFromFileObjects = (objects: any[], includeNewPath?: boolean): Table => {
	let columns = ['#', 'File', 'Path'];
	if (includeNewPath) columns.push('New Path');

	const table = new Table({style: {head: ['black'], compact: true}, head: columns});

	const clean = _.map(_.cloneDeep(objects), (o: any) => {
		if ('' === o?.name) o.name = '*';
		return o;
	});

	let id = 0;
	_.each(clean, (o: any) => table.push([++id, ..._.values(_.omit(o, ['full']))]));
	return table;
};

export default getTableFromFileObjects;
