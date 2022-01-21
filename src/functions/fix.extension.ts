#!/usr/bin/env node
'use strict';

import {startsWith, toLower} from 'lodash';

const fixExtension = (ext: string): string => {
	if (!startsWith(ext, '.')) ext = '.' + ext;
	return toLower(ext);
};

export default fixExtension;
