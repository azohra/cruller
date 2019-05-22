const cosmiconfig = require('cosmiconfig');
const explorer = cosmiconfig('cruller');
const config = explorer.searchSync().config;
const stampit = require('@stamp/it'); // eslint-disable-line
const visitable = require('../coreStamps/visitable'); // eslint-disable-line
var fs = require('fs');

const pages = require(`${process.cwd()}/${config.stampDirectory}/pages`); // eslint-disable-line
const shared = require(`${process.cwd()}/${config.stampDirectory}/shared`); // eslint-disable-line
const sections = require(`${process.cwd()}/${config.stampDirectory}/sections`); // eslint-disable-line

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getSectionString = ({folder: folder, section: section, env: env}) => {
    return `${folder}.${section}.${section}${capitalize(env)}`;
};

const getValidStampStrings = ({folder: folder, section: section, envMap: envMap}) => {
    // execute business-specific code
    if ((Object.keys(config)).includes('envExceptions')) envMap = config.envExceptions({envMap: envMap});
    
    // get stamp string for Base
    var stamps = [getSectionString({folder: folder, section: section, env: 'base'})];
    
    // get stamp strings for all options in envMap
    for (let envKey of Object.keys(envMap)) {
        stamps.push(getSectionString({folder: folder, section: section, env: envMap[envKey]}));
    }
    
    // determine which stamp strings are valid
    var validStamps = [];
    for (let stamp of stamps) {
        if (eval(`typeof ${stamp} == 'function'`)) validStamps.push(stamp);
    }

    // return valid stamp strings
    return validStamps;
};

const composer = ({page: page, envMap: envMap}) => {
    // start with stamps in coreStamps folder
    var validStamps = ['visitable'];

    // append page stamps
    var validPageStamps = getValidStampStrings({folder: 'pages', section: page, envMap: envMap});
    Array.prototype.push.apply(validStamps, validPageStamps);

    // append shared stamps
    let sharedNames = fs.readdirSync(`${process.cwd()}/${config.stampDirectory}/shared`).map((item) => {return item.substring(0, item.length-3);});
    sharedNames.splice( sharedNames.indexOf('index'), 1 );
    var validSharedStamps;
    for (let sharedName of sharedNames) {
        validSharedStamps = getValidStampStrings({folder: 'shared', section: sharedName, envMap: envMap});
        Array.prototype.push.apply(validStamps, validSharedStamps);
    }

    // get stampString
    var stampString = validStamps.join(', ');
    return eval(`stampit(${stampString})`);
};

module.exports = composer;