#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import getConfig from './functions/get.config';
import isIgnored from './functions/is.ignored';
import checkFolder from './functions/check.folder';
import fixExtension from './functions/fix.extension';
import getFilesListing from './functions/get.files.listing';
import convertFilesToObjects from './functions/convert.files.to.objects';
import getSkeletestFileContent from './functions/get.skeletest.file.content';
import getTableFromFileObjects from './functions/get.table.from.file.objects';

const VUE_FILE_EXTENSION = '.vue';

export default {
	run(commander: any) {
		console.clear();

		const options: any = _.pick(commander, ['config', 'fix', 'verbose']);
		const {fix = false, verbose = false} = options;

		const root = process.cwd();
		const config = getConfig(root, options?.config);
		if (verbose) console.log('\nUsing ', config);

		const {srcFolderName, testFolderName, considerVueFiles = false, considerCyTestFiles = false, useVitest = false, includeJsonFiles = false, ignoreMocksFolder = true} = config;
		let {filesExtension, testFileExtensionPrefix, ignoreSrcFiles = [], ignoreTestFiles = []} = config;

		const srcFolder = path.join(root, srcFolderName);
		checkFolder(srcFolder, 'Source');

		const testFolder = path.join(root, testFolderName);
		checkFolder(testFolder, 'Test');

		let additionalSourceExtensions = [];
		if (includeJsonFiles) additionalSourceExtensions.push('json');

		let srcFiles = getFilesListing(srcFolder, filesExtension, additionalSourceExtensions);
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

		srcFiles = _.filter(srcFiles, (f) => !isIgnored(ignoreSrcFiles, f));
		testFiles = _.filter(testFiles, (f) => !isIgnored(ignoreTestFiles, f));

		if (verbose) console.log('\nAdjusted Source Files:\n', '-', srcFiles.join('\n - '));
		if (verbose) console.log('\nAdjusted Test Files:\n', '-', testFiles.join('\n - '));

		let expectedTestFiles = _.map(srcFiles, (file) => {
			file = file.replace(srcFolder, testFolder);
			const parts = _.initial(_.split(file, '.'));
			file = `${_.join(parts, '.')}${testFileExtensionPrefix}${filesExtension}`;
			return file;
		});
		if (ignoreMocksFolder) expectedTestFiles = _.filter(expectedTestFiles, (file) => !_.includes(file, '__mocks__'));

		if (verbose) console.log('\nExpected Test Files:\n', '-', expectedTestFiles.join('\n - '));

		let wrongTestFiles = _.difference(testFiles, expectedTestFiles);
		let missingTestFiles = _.difference(expectedTestFiles, testFiles);

		if (considerCyTestFiles) {
			const cyTestFileExtensionPrefix = fixExtension('cy');
			const expectedCyTestFiles = _.map(srcFiles, (file) => {
				file = file.replace(srcFolder, testFolder);
				file = file.replace(filesExtension, cyTestFileExtensionPrefix + filesExtension);

				if (considerVueFiles) {
					file = file.replace(VUE_FILE_EXTENSION, cyTestFileExtensionPrefix + filesExtension);
				}
				return file;
			});

			wrongTestFiles = _.difference(wrongTestFiles, expectedCyTestFiles);

			_.each(testFiles, (testFile) => {
				testFile = testFile.replace(cyTestFileExtensionPrefix + filesExtension, testFileExtensionPrefix + filesExtension);
				_.remove(missingTestFiles, (missingFile) => missingFile === testFile);
			});
		}

		const wrongTestObjects = convertFilesToObjects(wrongTestFiles);
		const missingTestObjects = convertFilesToObjects(missingTestFiles);

		if (!_.isEmpty(ignoreTestFiles)) {
			console.log('\nIgnoring test files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreTestFiles)).toString());
		}

		if (!_.isEmpty(wrongTestObjects)) {
			console.log('\nWrong test files:');
			console.log(getTableFromFileObjects(wrongTestObjects).toString());
		} else console.log('\nAll test files match respective source files.');

		if (!_.isEmpty(ignoreSrcFiles)) {
			console.log('\nIgnoring source files:');
			console.log(getTableFromFileObjects(convertFilesToObjects(ignoreSrcFiles)).toString());
		}

		if (!_.isEmpty(missingTestObjects)) {
			console.log('\nMissing test files:');
			console.log(getTableFromFileObjects(missingTestObjects).toString());
		} else console.log('\nAll expected test files accounted for.');

		if (fix) {
			console.log('\nFix is set to true. Fixing what I can...\n');

			const filesToMove: any[] = [];
			const filesNotToMove: any[] = [];
			const expectedTestFileObjects = convertFilesToObjects(expectedTestFiles);
			_.each(expectedTestFileObjects, (m) => {
				let matches = _.filter(wrongTestObjects, (w) => w.name === m.name);
				matches = _.map(matches, (match) => ({...match, newPath: m.path}));
				if (_.size(matches) === 1) filesToMove.push(...matches);
				if (_.size(matches) > 1) filesNotToMove.push(...matches);
			});

			const missingFolders = _.uniq(_.map(missingTestObjects, 'path'));
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

			if (!_.isEmpty(missingTestObjects)) {
				console.log('\nCreating files...');
				_.each(missingTestObjects, (file) => {
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
