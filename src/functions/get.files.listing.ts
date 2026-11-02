#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';

import fixExtension from './fix.extension';

const getFilesListing: Function = (root: string, extensions: string | string[], additionalExtensions: string[] = []): any[] => {
	const extensionsArray: string[] = Array.isArray(extensions) ? extensions : [extensions];

	additionalExtensions = _.map(additionalExtensions, fixExtension);
	const normalizedExtensions: string[] = _.map(extensionsArray, fixExtension);

	let files: string[] = [];
	const children: fs.Dirent[] = fs.readdirSync(root, {withFileTypes: true});

	_.each(children, (child: fs.Dirent): void => {
		const childFullPath: string = path.join(root, child.name);
		if (child.isDirectory()) {
			files = _.concat(files, getFilesListing(childFullPath, extensions, additionalExtensions));
			return;
		}
		const fileExt: string = _.toLower(path.extname(child.name));
		if (_.includes(normalizedExtensions, fileExt) || _.includes(additionalExtensions, fileExt)) files.push(childFullPath);
	});

	return _.sortBy(files);
};

export default getFilesListing;
