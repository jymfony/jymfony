const { basename, dirname } = require('path');

process.env.LAMBDA_TASK_ROOT = dirname(__dirname);
process.env._HANDLER = basename(__filename) + '.handler';
const { lambda } = require('../lambda');

exports.handler = lambda(async function (env) {
    return function () {
        process.stdout.write('[' + env.APP_ENV + '] TEST');
    };
});

// Test handler
exports.handler({}, {});
