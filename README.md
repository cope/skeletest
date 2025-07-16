# skeletest

test skeleton creator

## optional config

You can change default configuration via ```.skeletest.json``` file:

```
{
	"srcFolderName": "src",                 // default: "src"
	"filesExtensions": ["ts", "js"],        // default: ["ts", "js"] - array of file extensions to process
	"testFolderName": "test",               // default: "test"
	"testFileExtensionPrefix": "spec",      // default detects: "spec" for typescript and "test" for javascript

	"considerVueFiles": true,               // default: false - if true, skeletest checks for test files matching .vue files
	"considerCyTestFiles": true,            // default: false - if true, skeletest considers test files with .cy extension
	"useVitest": true,                      // default: false - if true, skeletest uses vitest describe and it for "it.todo"
	"includeJsonFiles": true,               // default: false - if true, skeletest creates skeleton test files for .json files as well
	"ignoreMocksFolder": false,             // default: true - if true, skeletest ignores files in all __mocks__ folders

	"ignoreSrcFiles": ["file1.ts"...],      // ignore these source files - default: []
	"ignoreTestFiles": ["file3.spec.ts"...] // ignore these test files - default: []
}
```

## help

```
skeletest -h
```

Output:

```
C:\git\github\skeletest> skeletest -h
Usage: index [options]

Create test skeleton.
Use .skeletest.json config file to override default settings.

Options:
  -V, --version          output the version number
  -f, --fix              Fix missing test files (default: false)
  -c, --config <config>  Alternative config file (must be .json) (default: ".skeletest.json")
  -h, --help             display help for command
```

## run skeletest check

```
skeletest
```

Output:

```
C:\git\github\skeletest> skeletest

Use .skeletest.json config file to override default settings.

Wrong test files:
┌───┬────────────────────────────┬──────────────────────────────────┐
│ # │ File                       │ Path                             │
├───┼────────────────────────────┼──────────────────────────────────┤
│ 1 │ check.folder.spec.ts       │ C:\git\github\skeletest\test\bla │
│ 2 │ check.folder.spec.ts       │ C:\git\github\skeletest\test     │
│ 3 │ get.table.of.files.spec.ts │ C:\git\github\skeletest\test     │
└───┴────────────────────────────┴──────────────────────────────────┘

Missing test files:
┌────┬─────────────────────────────────────┬────────────────────────────────────────┐
│ #  │ File                                │ Path                                   │
├────┼─────────────────────────────────────┼────────────────────────────────────────┤
│ 1  │ check.folder.spec.ts                │ C:\git\github\skeletest\test\functions │
│ 2  │ convert.files.to.objects.spec.ts    │ C:\git\github\skeletest\test\functions │
│ 3  │ fix.extension.spec.ts               │ C:\git\github\skeletest\test\functions │
│ 4  │ get.config.spec.ts                  │ C:\git\github\skeletest\test\functions │
│ 5  │ get.files.listing.spec.ts           │ C:\git\github\skeletest\test\functions │
│ 6  │ get.table.from.file.objects.spec.ts │ C:\git\github\skeletest\test\functions │
│ 7  │ get.table.of.files.spec.ts          │ C:\git\github\skeletest\test\functions │
│ 8  │ get.timestamp.spec.ts               │ C:\git\github\skeletest\test\functions │
│ 9  │ skeletest.spec.ts                   │ C:\git\github\skeletest\test           │
│ 10 │ process.spec.ts                     │ C:\git\github\skeletest\test           │
└────┴─────────────────────────────────────┴────────────────────────────────────────┘
```

## run skeletest check and fix

Use the -f option to have skeletest fix your test files

```
skeletest -f
```

Output:

```
C:\git\github\skeletest> skeletest -f

Use .skeletest.json config file to override default settings.


Wrong test files:
┌───┬────────────────────────────┬──────────────────────────────────┐
│ # │ File                       │ Path                             │
├───┼────────────────────────────┼──────────────────────────────────┤
│ 1 │ check.folder.spec.ts       │ C:\git\github\skeletest\test\bla │
│ 2 │ check.folder.spec.ts       │ C:\git\github\skeletest\test     │
│ 3 │ get.table.of.files.spec.ts │ C:\git\github\skeletest\test     │
└───┴────────────────────────────┴──────────────────────────────────┘

Missing test files:
┌────┬─────────────────────────────────────┬────────────────────────────────────────┐
│ #  │ File                                │ Path                                   │
├────┼─────────────────────────────────────┼────────────────────────────────────────┤
│ 1  │ check.folder.spec.ts                │ C:\git\github\skeletest\test\functions │
│ 2  │ convert.files.to.objects.spec.ts    │ C:\git\github\skeletest\test\functions │
│ 3  │ fix.extension.spec.ts               │ C:\git\github\skeletest\test\functions │
│ 4  │ get.config.spec.ts                  │ C:\git\github\skeletest\test\functions │
│ 5  │ get.files.listing.spec.ts           │ C:\git\github\skeletest\test\functions │
│ 6  │ get.table.from.file.objects.spec.ts │ C:\git\github\skeletest\test\functions │
│ 7  │ get.table.of.files.spec.ts          │ C:\git\github\skeletest\test\functions │
│ 8  │ get.timestamp.spec.ts               │ C:\git\github\skeletest\test\functions │
│ 9  │ skeletest.spec.ts                   │ C:\git\github\skeletest\test           │
│ 10 │ process.spec.ts                     │ C:\git\github\skeletest\test           │
└────┴─────────────────────────────────────┴────────────────────────────────────────┘

Fix is set to true. Fixing what I can...


Creating all missing folders...
 - Checking C:\git\github\skeletest\test\functions ...
 - Checking C:\git\github\skeletest\test ...
Done.

Files I can move:
┌───┬────────────────────────────┬──────────────────────────────┬────────────────────────────────────────┐
│ # │ File                       │ Path                         │ New Path                               │
├───┼────────────────────────────┼──────────────────────────────┼────────────────────────────────────────┤
│ 1 │ get.table.of.files.spec.ts │ C:\git\github\skeletest\test │ C:\git\github\skeletest\test\functions │
└───┴────────────────────────────┴──────────────────────────────┴────────────────────────────────────────┘

Moving files...
 - Moving get.table.of.files.spec.ts from C:\git\github\skeletest\test to C:\git\github\skeletest\test\functions ...
Done.

Creating files...
 - Creating C:\git\github\skeletest\test\functions\check.folder.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\convert.files.to.objects.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\fix.extension.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\get.config.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\get.files.listing.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\get.table.from.file.objects.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\get.table.of.files.spec.ts ...
 - Creating C:\git\github\skeletest\test\functions\get.timestamp.spec.ts ...
 - Creating C:\git\github\skeletest\test\skeletest.spec.ts ...
 - Creating C:\git\github\skeletest\test\process.spec.ts ...
Done.

Files I could NOT move:
┌───┬──────────────────────┬──────────────────────────────────┬────────────────────────────────────────┐
│ # │ File                 │ Path                             │ New Path                               │
├───┼──────────────────────┼──────────────────────────────────┼────────────────────────────────────────┤
│ 1 │ check.folder.spec.ts │ C:\git\github\skeletest\test\bla │ C:\git\github\skeletest\test\functions │
│ 2 │ check.folder.spec.ts │ C:\git\github\skeletest\test     │ C:\git\github\skeletest\test\functions │
└───┴──────────────────────┴──────────────────────────────────┴────────────────────────────────────────┘
```

## skeletest generated file

For a given file, eg. ```check.folder.ts```, skeletest will generate a ```check.folder.spec.ts``` file, with the following content:

```
describe('check.folder.ts tests', () => {
	it('should be implemented');
});
```
