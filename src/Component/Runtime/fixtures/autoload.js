const { dirname } = require('path');

try {
    require.resolve('@jymfony/autoload');
} catch (e) {
    if ('MODULE_NOT_FOUND' === e.code) {
        process.env.LAMBDA_TASK_ROOT = dirname(dirname(dirname(dirname(__dirname))));
    } else {
        throw e;
    }
}

require('..');
