#!/usr/bin/env node
'use strict';

const bail = (code: number = 2): void => process.exit(code);
export default bail;
