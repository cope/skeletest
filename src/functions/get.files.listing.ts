#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';

import fixExtension from './fix.extension';

const getFilesListing = (root: string, ext: string, additionalExtensions: string[] = []): any[] => {
	additionalExtensions = _.map(additionalExtensions, fixExtension);
	ext = fixExtension(ext);

	let files: string[] = [];
	const children = fs.readdirSync(root);

	const subfiles = _.filter(children, (child: string) => !fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfiles, (file) => {
		const fileExt = _.toLower(path.extname(file));
		if (ext === fileExt) files.push(path.join(root, file));
		else if (_.includes(additionalExtensions, fileExt)) files.push(path.join(root, file));
	});

	const subfolders = _.filter(children, (child: string) => fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfolders, (folder) => {
		const folderFullPath = path.join(root, folder);
		files = _.concat(files, getFilesListing(folderFullPath, ext, additionalExtensions));
	});

	return _.sortBy(files);
};

export default getFilesListing;
