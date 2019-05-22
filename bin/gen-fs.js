#! /usr/bin/env node
const fs = require('fs-extra');
fs.copySync(__dirname+'/folderStructure', process.cwd());
