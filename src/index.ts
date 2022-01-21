#!/usr/bin/env node
'use strict';

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Create test skeleton
 * Usage:
 * -x, --exit             Does nothing
 *
 * <no params>            Does something
 */

import {Command} from 'commander';

console.log('\nUse .skeletest.json config file to override default settings.\n');

const commander: any = new Command();
const packageJson = require('../package.json');

commander
	.version(packageJson.version)
	.description('Create test skeleton.\nUse .skeletest.json config file to override default settings.')
	.option('-r, --report_only', 'Do not create missing files and folders', false)
	.option('-c, --config <config>', 'Alternative JSON config file (must be .json)', '.skeletest.json')
	.parse(process.argv);

import skeleton from './skeleton';

skeleton.run(commander.opts());
