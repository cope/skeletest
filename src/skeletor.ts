#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import getConfig from './functions/get.config';
import checkFolder from './functions/check.folder';
import fixExtension from './functions/fix.extension';
import getFilesListing from './functions/get.files.listing';
import convertFilesToObjects from './functions/convert.files.to.objects';
import getTableFromFileObjects from './functions/get.table.from.file.objects';
import getSkeletestFileContent from './functions/get.skeletest.file.content';

export default {
	run(commander: any) {
		const options: any = _.pick(commander, ['config', 'fix']);

		const root = process.cwd();
		const config = getConfig(root, options?.config);

		const {srcFolderName, testFolderName, useTestTodo = false} = config;
		let {filesExtension, testFileExtensionPrefix, ignoreSrcFiles = [], ignoreTestFiles = []} = config;
		filesExtension = fixExtension(filesExtension);
		testFileExtensionPrefix = fixExtension(testFileExtensionPrefix);

		const srcFolder = path.join(root, srcFolderName);
		checkFolder(srcFolder, 'Source');

		const testFolder = path.join(root, testFolderName);
		checkFolder(testFolder, 'Test');

		let srcFiles = getFilesListing(srcFolder, filesExtension);
		let testFiles = getFilesListing(testFolder, filesExtension);

		ignoreSrcFiles = _.map(ignoreSrcFiles, (f) => path.join(root, f));
		ignoreTestFiles = _.map(ignoreTestFiles, (f) => path.join(root, f));

		srcFiles = _.filter(srcFiles, (f) => !_.includes(ignoreSrcFiles, f));
		testFiles = _.filter(testFiles, (f) => !_.includes(ignoreTestFiles, f));

		const expectedTestFiles = _.map(srcFiles, (file) => file.replace(srcFolder, testFolder).replace(filesExtension, testFileExtensionPrefix + filesExtension));
		const wrongTestFiles = convertFilesToObjects(_.difference(testFiles, expectedTestFiles));
		const missingTestFiles = convertFilesToObjects(_.difference(expectedTestFiles, testFiles));

		if (!_.isEmpty(ignoreTestFiles)) {
			console.log('\nIgnoring test files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreTestFiles)).toString());
		}

		if (!_.isEmpty(wrongTestFiles)) {
			console.log('\nWrong test files:');
			console.log(getTableFromFileObjects(wrongTestFiles).toString());
		}

		if (!_.isEmpty(ignoreSrcFiles)) {
			console.log('\nIgnoring source files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreSrcFiles)).toString());
		}

		if (!_.isEmpty(missingTestFiles)) {
			console.log('\nMissing test files:');
			console.log(getTableFromFileObjects(missingTestFiles).toString());
		}

		if (options?.fix) {
			console.log('\nFix is set to true. Fixing what I can...\n');

			const filesToMove: any[] = [];
			const filesNotToMove: any[] = [];
			const expectedTestFileObjects = convertFilesToObjects(expectedTestFiles);
			_.each(expectedTestFileObjects, (m) => {
				let matches = _.filter(wrongTestFiles, (w) => w.name === m.name);
				matches = _.map(matches, (match) => ({...match, newPath: m.path}));
				if (_.size(matches) === 1) filesToMove.push(...matches);
				if (_.size(matches) > 1) filesNotToMove.push(...matches);
			});

			const missingFolders = _.uniq(_.map(missingTestFiles, 'path'));
			if (!_.isEmpty(missingFolders)) {
				console.log('\nCreating all missing folders...');
				_.each(missingFolders, (path) => {
					console.log(' - Checking', path, '...');
					if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});
				});
				console.log('Done.');
			}

			if (!_.isEmpty(filesToMove)) {
				console.log('\nFiles I can move:');
				console.log(getTableFromFileObjects(filesToMove, true).toString());

				console.log('\nMoving files...');
				_.each(filesToMove, (file) => {
					console.log(' - Moving', file.name, 'from', file.path, 'to', file.newPath, '...');
					fs.renameSync(path.join(file.path, file.name), path.join(file.newPath, file.name));
				});
				console.log('Done.');
			}

			if (!_.isEmpty(missingTestFiles)) {
				console.log('\nCreating files...');
				_.each(missingTestFiles, (file) => {
					const fullPath = path.join(file.path, file.name);
					if (!fs.existsSync(fullPath)) {
						console.log(' - Creating', fullPath, '...');
						fs.writeFileSync(fullPath, getSkeletestFileContent(useTestTodo, file.name, testFileExtensionPrefix));
					}
				});
				console.log('Done.');
			}

			if (!_.isEmpty(filesNotToMove)) {
				console.log('\nFiles I could NOT move:');
				console.log(getTableFromFileObjects(filesNotToMove, true).toString());
			}
		}
	}
};
