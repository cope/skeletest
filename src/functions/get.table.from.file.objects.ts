#!/usr/bin/env node
'use strict';

import _ from 'lodash';
import Table from 'cli-table';

const getTableFromFileObjects = (objects: any[], includeNewPath?: boolean): Table => {
	const columns: string[] = ['#', 'File', 'Path'];
	if (includeNewPath) columns.push('New Path');

	const table = new Table({style: {head: ['black'], compact: true}, head: columns});

	const clean: any[] = _.map(_.cloneDeep(objects), (o: any): any => {
		if (!o) return null;
		if ('' === o.name) o.name = '*';
		return o;
	});

	let id: number = 0;
	_.each(clean, (o: any) => table.push([++id, ..._.values(_.omit(o, ['full']))]));
	return table;
};

export default getTableFromFileObjects;
