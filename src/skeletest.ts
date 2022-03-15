#!/usr/bin/env node
'use strict';

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Create test skeleton
 * Usage:
 * -f, --fix            Fix missing test files
 * -c, --config         Alternative config file (must be .json)
 * -v, --verbose        Verbose
 *
 * <no params>          Lists issues
 */

import {Command} from 'commander';
import skeletor from './skeletor';

const commander: any = new Command();
const packageJson = require('../package.json');

commander
	.version(packageJson.version)
	.description('Create test skeleton.\nUse .skeletest.json config file to override default settings.')
	.option('-f, --fix', 'Fix missing test files', false)
	.option('-c, --config <config>', 'Alternative config file (must be .json)', '.skeletest.json')
	.option('-v, --verbose', 'Verbose', false)
	.parse(process.argv);

const options = commander.opts();
if (!options?.help) console.log('\nUse .skeletest.json config file to override default settings.\n');

skeletor.run(options);
