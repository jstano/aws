const tsn = require('ts-node');
const path = require('path');

// use *our* ts-node to compile our typescript files imported in index.ts
tsn.register({
   // my typescript file has all my ts-node config setup correctly to fit my project correctly
   project: './tsconfig.json',
});

const tsConfigPaths = require('tsconfig-paths')
const tsConfig = require(__dirname + '/tsconfig.json')
const args = {
   baseUrl: path.resolve(__dirname),
   paths: tsConfig.compilerOptions.paths,
}
tsConfigPaths.register(args)

// import main.ts
const result = require('./index');

// ensure outputs from main are propagated back up to pulumi
module.exports = result;
