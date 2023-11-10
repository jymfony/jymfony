require('./autoload');
const lambda = require('../lambda');

exports.handler = lambda(async function (env) {
    env = env.APP_ENV ?? 'dev';
    const debug = '0' !== env.APP_DEBUG;
    const kernel = new App.Kernel(env, debug);
    await kernel.boot();

    return kernel.container.get(Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler);
});
