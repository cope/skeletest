#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import getConfig from './functions/get.config';
import checkFolder from './functions/check.folder';
import getFilesListing from './functions/get.files.listing';
import convertFilesToObjects from './functions/convert.files.to.objects';
import getTableFromFileObjects from './functions/get.table.from.file.objects';
import getSkeletestFileContent from './functions/get.skeletest.file.content';

const VUE_FILE_EXTENSION = '.vue';

export default {
	run(commander: any) {
		console.clear();

		const options: any = _.pick(commander, ['config', 'fix', 'verbose']);
		const {fix = false, verbose = false} = options;

		const root = process.cwd();
		const config = getConfig(root, options?.config);
		if (verbose) console.log('\nUsing ', config);

		const {srcFolderName, testFolderName, considerVueFiles = false, useVitest = false} = config;
		let {filesExtension, testFileExtensionPrefix, ignoreSrcFiles = [], ignoreTestFiles = []} = config;

		const srcFolder = path.join(root, srcFolderName);
		checkFolder(srcFolder, 'Source');

		const testFolder = path.join(root, testFolderName);
		checkFolder(testFolder, 'Test');

		let srcFiles = getFilesListing(srcFolder, filesExtension);
		let testFiles = getFilesListing(testFolder, filesExtension);

		if (considerVueFiles) {
			let vueSrcFiles = getFilesListing(srcFolder, VUE_FILE_EXTENSION);
			srcFiles = _.concat(srcFiles, vueSrcFiles);
			srcFiles = _.sortBy(srcFiles);
		}

		if (verbose) console.log('\nSource Files:\n', '-', srcFiles.join('\n - '));
		if (verbose) console.log('\nTest Files:\n', '-', testFiles.join('\n - '));

		ignoreSrcFiles = _.map(ignoreSrcFiles, (f) => path.join(root, f));
		ignoreTestFiles = _.map(ignoreTestFiles, (f) => path.join(root, f));

		if (verbose) console.log('\nIgnore Source Files:\n', '-', ignoreSrcFiles.join('\n - '));
		if (verbose) console.log('\nIgnore Test Files:\n', '-', ignoreTestFiles.join('\n - '));

		srcFiles = _.filter(srcFiles, (f) => !_.includes(ignoreSrcFiles, f));
		testFiles = _.filter(testFiles, (f) => !_.includes(ignoreTestFiles, f));

		if (verbose) console.log('\nAdjusted Source Files:\n', '-', srcFiles.join('\n - '));
		if (verbose) console.log('\nAdjusted Test Files:\n', '-', testFiles.join('\n - '));

		const expectedTestFiles = _.map(srcFiles, (file) => {
			file = file.replace(srcFolder, testFolder);
			file = file.replace(filesExtension, testFileExtensionPrefix + filesExtension);

			if (considerVueFiles) {
				file = file.replace(VUE_FILE_EXTENSION, testFileExtensionPrefix + filesExtension);
			}
			return file;
		});

		if (verbose) console.log('\nExpected Test Files:\n', '-', expectedTestFiles.join('\n - '));

		const wrongTestFiles = convertFilesToObjects(_.difference(testFiles, expectedTestFiles));
		const missingTestFiles = convertFilesToObjects(_.difference(expectedTestFiles, testFiles));

		if (!_.isEmpty(ignoreTestFiles)) {
			console.log('\nIgnoring test files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreTestFiles)).toString());
		}

		if (!_.isEmpty(wrongTestFiles)) {
			console.log('\nWrong test files:');
			console.log(getTableFromFileObjects(wrongTestFiles).toString());
		} else console.log('\nAll test files match respective source files.');

		if (!_.isEmpty(ignoreSrcFiles)) {
			console.log('\nIgnoring source files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreSrcFiles)).toString());
		}

		if (!_.isEmpty(missingTestFiles)) {
			console.log('\nMissing test files:');
			console.log(getTableFromFileObjects(missingTestFiles).toString());
		} else console.log('\nAll expected test files accounted for.');

		if (fix) {
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
						fs.writeFileSync(fullPath, getSkeletestFileContent(useVitest, file.name, testFileExtensionPrefix));
					}
				});
				console.log('Done.');
			}

			if (!_.isEmpty(filesNotToMove)) {
				console.log('\nFiles I could NOT move:');
				console.log(getTableFromFileObjects(filesNotToMove, true).toString());
			}
		}
		console.log('\n');
	}
};
