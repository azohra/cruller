const cosmiconfig = require('cosmiconfig');
const explorer = cosmiconfig('cruller');

const config = explorer.searchSync().config;
const env = config.variables;

var envKeys = Object.keys(env).map((x) => x.toUpperCase());
var cartesianArgs = envKeys.map((envKey) => ((process.env[envKey] === undefined) ? Object.keys(env[envKey.toLowerCase()]) : process.env[envKey].split(',')));

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = ([a, b, ...c]) => (b ? cartesian([f(a, b), ...c]) :a);

const permutations = cartesian(cartesianArgs);

module.exports = permutations;
