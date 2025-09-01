'use strict';

import * as path from 'path';
import skeletor from '../src/skeletor';

// Mock all dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('../src/functions/bail');
jest.mock('../src/functions/get.config');
jest.mock('../src/functions/is.ignored');
jest.mock('../src/functions/check.folder');
jest.mock('../src/functions/fix.extension');
jest.mock('../src/functions/get.files.listing');
jest.mock('../src/functions/convert.files.to.objects');
jest.mock('../src/functions/get.skeletest.file.content');
jest.mock('../src/functions/get.table.from.file.objects');

// Import mocked functions
import bail from '../src/functions/bail';
import getConfig from '../src/functions/get.config';
import isIgnored from '../src/functions/is.ignored';
import checkFolder from '../src/functions/check.folder';
import fixExtension from '../src/functions/fix.extension';
import getFilesListing from '../src/functions/get.files.listing';
import convertFilesToObjects from '../src/functions/convert.files.to.objects';
import getSkeletestFileContent from '../src/functions/get.skeletest.file.content';
import getTableFromFileObjects from '../src/functions/get.table.from.file.objects';

const mockedBail = bail as any;
const mockedGetConfig = getConfig as any;
const mockedIsIgnored = isIgnored as any;
const mockedCheckFolder = checkFolder as any;
const mockedFixExtension = fixExtension as any;
const mockedGetFilesListing = getFilesListing as any;
const mockedConvertFilesToObjects = convertFilesToObjects as any;
const mockedGetSkeletestFileContent = getSkeletestFileContent as any;
const mockedGetTableFromFileObjects = getTableFromFileObjects as any;

// Mock console.log
let consoleLogSpy: jest.SpyInstance;

describe('skeletor tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

		// Mock process.cwd()
		jest.spyOn(process, 'cwd').mockReturnValue('/test/root');

		// Mock path.join
		(path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

		// Default mocks
		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts'
		});
		mockedCheckFolder.mockImplementation(() => {});
		mockedGetFilesListing.mockReturnValue([]);
		mockedIsIgnored.mockReturnValue(false);
		mockedConvertFilesToObjects.mockReturnValue([]);
		mockedGetTableFromFileObjects.mockReturnValue({toString: () => 'table'});
		mockedGetSkeletestFileContent.mockReturnValue('test content');
		mockedFixExtension.mockReturnValue('.cy');
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		jest.restoreAllMocks();
	});

	test('should run successfully when everything is awesome', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.ts']);

		skeletor.run(options);

		expect(mockedGetConfig).toHaveBeenCalledWith('/test/root', '.skeletest.json');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/src', 'Source');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/test', 'Test');
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('*** Skeletest: ***'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Everything is awesome!'));
		expect(mockedBail).not.toHaveBeenCalled();
	});

	test('should report missing test files when fix is false', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce([]); // test files (empty)
		mockedConvertFilesToObjects.mockReturnValue([{name: 'file1.spec.ts', path: '/test/root/test', full: '/test/root/test/file1.spec.ts'}]);

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Missing test files'));
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('There are missing test files!'));
	});

	test('should handle verbose mode', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: true};

		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts',
			ignoreSrcFiles: ['src/ignored.ts'],
			ignoreTestFiles: ['test/ignored.spec.ts']
		});

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.ts']);

		skeletor.run(options);

		// Check that verbose logging happens (console.log is called with multiple args)
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: using ', expect.any(Object));
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Source Files:\n', '-', '/test/root/src/file1.ts');
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Test Files:\n', '-', '/test/root/src/file1.ts');
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Ignore Source Files:\n', '-', '/test/root/src/ignored.ts');
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Ignore Test Files:\n', '-', '/test/root/test/ignored.spec.ts');
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Adjusted Source Files:\n', '-', '/test/root/src/file1.ts');
		expect(consoleLogSpy).toHaveBeenCalledWith('\nSkeletest: Expected Test Files:\n', '-', '/test/root/test/file1.spec.ts');
	});

	test('should handle Cypress test files when considerCyTestFiles is true', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts',
			considerCyTestFiles: true
		});

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce(['/test/root/test/file1.cy.ts']); // test files with cy extension

		skeletor.run(options);

		expect(mockedFixExtension).toHaveBeenCalledWith('cy');
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Everything is awesome!'));
	});

	test('should display ignored test files when ignoreTestFiles is not empty', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts',
			ignoreTestFiles: ['test/ignored.spec.ts']
		});

		mockedGetFilesListing.mockReturnValue([]);

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Ignoring test files:'));
		expect(mockedGetTableFromFileObjects).toHaveBeenCalledWith(expect.any(Array));
	});

	test('should display ignored source files when ignoreSrcFiles is not empty', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts',
			ignoreSrcFiles: ['src/ignored.ts']
		});

		mockedGetFilesListing.mockReturnValue([]);

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Ignoring source files:'));
		expect(mockedGetTableFromFileObjects).toHaveBeenCalledWith(expect.any(Array));
	});

	test('should handle fix mode when everything is already awesome', () => {
		const options = {config: '.skeletest.json', fix: true, verbose: false};

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce(['/test/root/test/file1.spec.ts']); // test files match perfectly

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Everything is awesome!'));
	});

	test('should categorize wrong test files in fix mode', () => {
		const options = {config: '.skeletest.json', fix: true, verbose: false};

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce(['/test/root/test/wrongfolder/file1.spec.ts']); // test file in wrong location

		// Mock the objects in the right order
		mockedConvertFilesToObjects
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test/wrongfolder', full: '/test/root/test/wrongfolder/file1.spec.ts'}]) // wrongTestFiles
			.mockReturnValueOnce([]) // missingTestFiles (empty)
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test', full: '/test/root/test/file1.spec.ts'}]); // expectedTestFiles

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Fix is set to true'));
	});

	test('should create missing folders in fix mode', () => {
		const options = {config: '.skeletest.json', fix: true, verbose: false};
		const fs = require('fs');

		// Mock fs.existsSync to return false for the folder (doesn't exist)
		jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false); // for folder check
		// Mock fs.mkdirSync
		const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce([]); // no test files

		// Mock missing test files that need folders created
		mockedConvertFilesToObjects
			.mockReturnValueOnce([]) // wrongTestFiles (empty)
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test/newfolder', full: '/test/root/test/newfolder/file1.spec.ts'}]); // missingTestFiles

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Creating all missing folders'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Done creating missing folders'));
		expect(mkdirSyncSpy).toHaveBeenCalledWith('/test/root/test/newfolder', {recursive: true});

		mkdirSyncSpy.mockRestore();
	});

	test('should display files that could NOT be moved when there are multiple matches', () => {
		const options = {config: '.skeletest.json', fix: true, verbose: false};

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce(['/test/root/test/folder1/file1.spec.ts', '/test/root/test/folder2/file1.spec.ts']); // multiple wrong test files with same name

		// Mock multiple wrong test files with same name (can't be moved automatically)
		mockedConvertFilesToObjects
			.mockReturnValueOnce([
				{name: 'file1.spec.ts', path: '/test/root/test/folder1', full: '/test/root/test/folder1/file1.spec.ts'},
				{name: 'file1.spec.ts', path: '/test/root/test/folder2', full: '/test/root/test/folder2/file1.spec.ts'}
			]) // wrongTestFiles (multiple with same name)
			.mockReturnValueOnce([]) // missingTestFiles (empty)
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test', full: '/test/root/test/file1.spec.ts'}]); // expectedTestFiles

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Files I could NOT move'));
	});

	test('should ignore mocks folder when ignoreMocksFolder is true', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetConfig.mockReturnValue({
			srcFolderName: 'src',
			testFolderName: 'test',
			filesExtensions: ['.ts'],
			testFileExtensionPrefix: '.spec',
			testExtension: '.ts',
			ignoreMocksFolder: true
		});

		// The key is that src files will generate expected test files that include __mocks__ in the path
		// which will then be filtered out by line 73
		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/__mocks__/file1.ts']) // src file in __mocks__ folder
			.mockReturnValueOnce([]); // no test files

		skeletor.run(options);

		// The expected test file would be /test/root/test/__mocks__/file1.spec.ts
		// but it gets filtered out by line 73, so no missing test files are reported
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Everything is awesome!'));
	});

	test('should report both wrong AND missing test files when both exist', () => {
		const options = {config: '.skeletest.json', fix: false, verbose: false};

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts', '/test/root/src/file2.ts']) // src files
			.mockReturnValueOnce(['/test/root/test/wrongfolder/file1.spec.ts']); // one wrong test file

		// Mock the objects - file1 has wrong location, file2 is missing
		mockedConvertFilesToObjects
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test/wrongfolder', full: '/test/root/test/wrongfolder/file1.spec.ts'}]) // wrongTestFiles
			.mockReturnValueOnce([{name: 'file2.spec.ts', path: '/test/root/test', full: '/test/root/test/file2.spec.ts'}]); // missingTestFiles

		skeletor.run(options);

		// Should report both errors
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('There are wrong test files!'));
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('There are missing test files!'));
	});

	test('should create file when it does not exist in fix mode', () => {
		const options = {config: '.skeletest.json', fix: true, verbose: false};
		const fs = require('fs');

		// Mock fs.existsSync to return false for the file (doesn't exist)
		jest.spyOn(fs, 'existsSync').mockReturnValue(false); // for both folder and file checks
		// Mock fs.writeFileSync
		const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

		mockedGetFilesListing
			.mockReturnValueOnce(['/test/root/src/file1.ts']) // src files
			.mockReturnValueOnce([]); // no test files

		// Mock missing test files
		mockedConvertFilesToObjects
			.mockReturnValueOnce([]) // wrongTestFiles (empty)
			.mockReturnValueOnce([{name: 'file1.spec.ts', path: '/test/root/test', full: '/test/root/test/file1.spec.ts'}]); // missingTestFiles

		skeletor.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Creating files'));
		expect(writeFileSyncSpy).toHaveBeenCalled();

		writeFileSyncSpy.mockRestore();
	});
});
