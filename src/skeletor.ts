#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import _ from 'lodash';

import bail from './functions/bail';
import getConfig from './functions/get.config';
import isIgnored from './functions/is.ignored';
import checkFolder from './functions/check.folder';
import fixExtension from './functions/fix.extension';
import getFilesListing from './functions/get.files.listing';
import convertFilesToObjects from './functions/convert.files.to.objects';
import getSkeletestFileContent from './functions/get.skeletest.file.content';
import getTableFromFileObjects from './functions/get.table.from.file.objects';

const clc: any = require('cli-color');

export default {
	run(commander: any): void {
		console.log(clc.blue.bgGreen.bold('\n*** Skeletest: ***'));

		const options: any = _.pick(commander, ['config', 'fix', 'verbose']);
		const {fix = false, verbose = false} = options;

		const root: string = process.cwd();
		const config: any = getConfig(root, options?.config);
		if (verbose) console.log('\nSkeletest: using ', config);

		const {
			srcFolderName, //
			testFolderName,
			considerCyTestFiles = false,
			useVitest = false,
			ignoreMocksFolder = true
		} = config;
		const {filesExtensions, testFileExtensionPrefix, testExtension} = config;
		let {ignoreSrcFiles = [], ignoreTestFiles = []} = config;

		const srcFolder: string = path.join(root, srcFolderName);
		checkFolder(srcFolder, 'Source');

		const testFolder: string = path.join(root, testFolderName);
		checkFolder(testFolder, 'Test');

		let srcFiles: any[] = getFilesListing(srcFolder, filesExtensions);
		let testFiles: any[] = getFilesListing(testFolder, filesExtensions);

		if (verbose) console.log('\nSkeletest: Source Files:\n', '-', srcFiles.join('\n - '));
		if (verbose) console.log('\nSkeletest: Test Files:\n', '-', testFiles.join('\n - '));

		ignoreSrcFiles = _.map(ignoreSrcFiles, (f) => path.join(root, f));
		ignoreTestFiles = _.map(ignoreTestFiles, (f) => path.join(root, f));

		if (verbose) console.log('\nSkeletest: Ignore Source Files:\n', '-', ignoreSrcFiles.join('\n - '));
		if (verbose) console.log('\nSkeletest: Ignore Test Files:\n', '-', ignoreTestFiles.join('\n - '));

		srcFiles = _.filter(srcFiles, (f) => !isIgnored(ignoreSrcFiles, f));
		testFiles = _.filter(testFiles, (f) => !isIgnored(ignoreTestFiles, f));

		if (verbose) console.log('\nSkeletest: Adjusted Source Files:\n', '-', srcFiles.join('\n - '));
		if (verbose) console.log('\nSkeletest: Adjusted Test Files:\n', '-', srcFiles.join('\n - '));

		let expectedTestFiles = _.map(srcFiles, (file) => {
			file = file.replace(srcFolder, testFolder);
			const parts = _.initial(_.split(file, '.'));
			file = `${_.join(parts, '.')}${testFileExtensionPrefix}${testExtension}`;
			return file;
		});
		if (ignoreMocksFolder) expectedTestFiles = _.filter(expectedTestFiles, (file) => !_.includes(file, '__mocks__'));

		if (verbose) console.log('\nSkeletest: Expected Test Files:\n', '-', expectedTestFiles.join('\n - '));

		let wrongTestFiles = _.difference(testFiles, expectedTestFiles);
		const missingTestFiles = _.difference(expectedTestFiles, testFiles);

		if (considerCyTestFiles) {
			const cyTestFileExtensionPrefix = fixExtension('cy');
			const expectedCyTestFiles = _.map(srcFiles, (file) => {
				file = file.replace(srcFolder, testFolder);
				const fileExt = path.extname(file);
				file = file.replace(fileExt, cyTestFileExtensionPrefix + testExtension);

				return file;
			});

			wrongTestFiles = _.difference(wrongTestFiles, expectedCyTestFiles);

			_.each(testFiles, (testFile) => {
				testFile = testFile.replace(cyTestFileExtensionPrefix + testExtension, testFileExtensionPrefix + testExtension);
				_.remove(missingTestFiles, (missingFile) => missingFile === testFile);
			});
		}

		const wrongTestObjects = convertFilesToObjects(wrongTestFiles);
		const missingTestObjects = convertFilesToObjects(missingTestFiles);

		if (!_.isEmpty(ignoreTestFiles)) {
			console.log(clc.blue('\nSkeletest: Ignoring test files:'));
			console.log(clc.blue(getTableFromFileObjects(convertFilesToObjects(ignoreTestFiles)).toString()));
		}

		if (!_.isEmpty(wrongTestObjects)) {
			console.log(clc.red('\nSkeletest: Wrong test files:'));
			console.log(clc.red(getTableFromFileObjects(wrongTestObjects).toString()));
		} else console.log(clc.green('✅  Skeletest: All test files match respective source files.'));

		if (!_.isEmpty(ignoreSrcFiles)) {
			console.log(clc.blue('\nSkeletest: Ignoring source files:'));
			console.log(clc.blue(getTableFromFileObjects(convertFilesToObjects(ignoreSrcFiles)).toString()));
		}

		if (!_.isEmpty(missingTestObjects)) {
			console.log(clc.red('\nSkeletest: Missing test files:'));
			console.log(clc.red(getTableFromFileObjects(missingTestObjects).toString()));
		} else console.log(clc.green('✅  Skeletest: All expected test files accounted for.'));

		if (fix) {
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

			if (_.isEmpty(missingFolders) && _.isEmpty(filesToMove) && _.isEmpty(missingTestObjects) && _.isEmpty(filesNotToMove)) {
				return console.log(clc.green('✅  ' + clc.bold('Skeletest') + ': Everything is awesome!\n'));
			}

			console.log(clc.blue('\n🔍  Skeletest: Fix is set to true. Fixing what I can...\n'));

			if (!_.isEmpty(missingFolders)) {
				console.log(clc.blue('\nSkeletest: Creating all missing folders...'));
				_.each(missingFolders, (path) => {
					console.log(clc.blue(' - Skeletest Checking ' + clc.bold(path) + ' ...'));
					if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});
				});
				console.log(clc.blue('Skeletest: Done creating missing folders.'));
			}

			if (!_.isEmpty(filesToMove)) {
				console.log(clc.magenta('\nSkeletest: Files I can move:'));
				console.log(clc.magenta(getTableFromFileObjects(filesToMove, true).toString()));

				console.log(clc.magenta('\nSkeletest: Moving files...'));
				_.each(filesToMove, (file) => {
					console.log(clc.magenta(' - Skeletest Moving ' + clc.bold(file.name) + ' from ' + clc.bold(file.path) + ' to ' + clc.bold(file.newPath) + ' ...'));
					fs.renameSync(path.join(file.path, file.name), path.join(file.newPath, file.name));
				});
				console.log(clc.magenta('Skeletest: Done moving files.'));
			}

			if (!_.isEmpty(missingTestObjects)) {
				console.log(clc.blue('\nSkeletest: Creating files...'));
				_.each(missingTestObjects, (file) => {
					const fullPath = path.join(file.path, file.name);
					if (!fs.existsSync(fullPath)) {
						console.log(clc.blue(' - Skeletest created test file: ' + clc.bold(fullPath) + '...'));
						fs.writeFileSync(fullPath, getSkeletestFileContent(useVitest, file.name, testFileExtensionPrefix));
					}
				});
				console.log(clc.blue('Skeletest: Done creating files.'));
			}

			if (!_.isEmpty(filesNotToMove)) {
				console.log(clc.red('\nSkeletest: Files I could NOT move:'));
				console.log(clc.red(getTableFromFileObjects(filesNotToMove, true).toString()));
			}

			console.log('\n');
		} else {
			if (_.isEmpty(wrongTestObjects) && _.isEmpty(missingTestObjects)) {
				return console.log(clc.green('✅  ' + clc.bold('Skeletest') + ': Everything is awesome!\n'));
			}

			let message = '\n';
			if (!_.isEmpty(wrongTestObjects)) message += clc.bold('Skeletest ERROR:') + ' There are wrong test files!\n';
			if (!_.isEmpty(missingTestObjects)) message += clc.bold('Skeletest ERROR:') + ' There are missing test files!\n';

			bail(clc.red(message));
		}
	}
};
