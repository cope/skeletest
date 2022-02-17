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

const commander: any = new Command();
const packageJson = require('../package.json');

commander
	.version(packageJson.version)
	.description('Create test skeleton.\nUse .skeletest.json config file to override default settings.')
	.option('-f, --fix', 'Fix missing test files', false)
	.option('-c, --config <config>', 'Alternative config file (must be .json)', '.skeletest.json')
	.parse(process.argv);

const options = commander.opts();
if (!options?.help) console.log('\nUse .skeletest.json config file to override default settings.\n');

import skeletor from './skeletor';

skeletor.run(options);
