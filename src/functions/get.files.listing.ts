#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';

import fixExtension from './fix.extension';

const getFilesListing: Function = (root: string, extensions: string | string[], additionalExtensions: string[] = []): any[] => {
	// Handle both single extension (backward compatibility) and array of extensions
	const extensionsArray: string[] = Array.isArray(extensions) ? extensions : [extensions];

	additionalExtensions = _.map(additionalExtensions, fixExtension);
	const normalizedExtensions: string[] = _.map(extensionsArray, fixExtension);

	let files: string[] = [];
	const children: string[] = fs.readdirSync(root);

	const subfiles: string[] = _.filter(children, (child: string): boolean => !fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfiles, (file: string): void => {
		const fileExt: string = _.toLower(path.extname(file));
		if (_.includes(normalizedExtensions, fileExt)) files.push(path.join(root, file));
		else if (_.includes(additionalExtensions, fileExt)) files.push(path.join(root, file));
	});

	const subfolders: string[] = _.filter(children, (child: string): boolean => fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfolders, (folder: string): void => {
		const folderFullPath: string = path.join(root, folder);
		files = _.concat(files, getFilesListing(folderFullPath, extensions, additionalExtensions));
	});

	return _.sortBy(files);
};

export default getFilesListing;
