# skeletest

test skeleton creator

## todo

- add "ignoreFiles" option in .skeletest.json

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
│ 9  │ index.spec.ts                       │ C:\git\github\skeletest\test           │
│ 10 │ skeleton.spec.ts                    │ C:\git\github\skeletest\test           │
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
│ 9  │ index.spec.ts                       │ C:\git\github\skeletest\test           │
│ 10 │ skeleton.spec.ts                    │ C:\git\github\skeletest\test           │
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
 - Creating C:\git\github\skeletest\test\index.spec.ts ...
 - Creating C:\git\github\skeletest\test\skeleton.spec.ts ...
Done.

Files I could NOT move:
┌───┬──────────────────────┬──────────────────────────────────┬────────────────────────────────────────┐
│ # │ File                 │ Path                             │ New Path                               │
├───┼──────────────────────┼──────────────────────────────────┼────────────────────────────────────────┤
│ 1 │ check.folder.spec.ts │ C:\git\github\skeletest\test\bla │ C:\git\github\skeletest\test\functions │
│ 2 │ check.folder.spec.ts │ C:\git\github\skeletest\test     │ C:\git\github\skeletest\test\functions │
└───┴──────────────────────┴──────────────────────────────────┴────────────────────────────────────────┘
```
