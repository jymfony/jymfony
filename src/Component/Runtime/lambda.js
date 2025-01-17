const { compile } = require('@jymfony/compiler');
const { runInThisContext } = require('vm');

const awsLambdaTaskRoot = process.env.LAMBDA_TASK_ROOT;

try {
    require('@jymfony/autoloader');
} catch (e) {
    if ('MODULE_NOT_FOUND' === e.code) {
        process.env.LAMBDA_TASK_ROOT = __dirname + '/../../..';
        require(__dirname + '/../Autoloader');
        process.env.LAMBDA_TASK_ROOT = awsLambdaTaskRoot;
    } else {
        throw e;
    }
}

const nullish = (value, cond) => ((undefined === value) || (null === value)) ? cond() : value;
const AwsLambdaRunnerInterface = Jymfony.Component.Runtime.Runner.AwsLambdaRunnerInterface;

let runtime = nullish(process.env.APP_RUNTIME, () => Jymfony.Component.Runtime.JymfonyRuntime);
const reflection = new ReflectionClass(runtime);

runtime = reflection.newInstance(Object.assign({
    project_dir: __jymfony.autoload.finder.findRoot(),
}, nullish(globalThis.APP_RUNTIME_OPTIONS, () => ({}))));

exports.lambda = function (init) {
    init = runInThisContext(compile('(' + init.toString() + ')', null, { asFunction: false, debug: false }));
    let started = false;
    let [ app, args ] = runtime.getResolver(init).resolve();

    return async function (event, context) {
        if (! started) {
            app = await app(...args);
            started = true;
        }

        const runner = runtime.getRunner(app);
        if (runner instanceof AwsLambdaRunnerInterface) {
            runner.setEvent(event);
            runner.setContext(context);
        }

        return runner.run();
    };
};

exports.streamingResponse = function (init) {
    init = runInThisContext(compile('(' + init.toString() + ')', null, { asFunction: false, debug: false }));
    let started = false;
    let [ app, args ] = runtime.getResolver(init).resolve();

    return awslambda.streamifyResponse(async function (event, streamingResponse, context) {
        if (! started) {
            app = await app(...args);
            started = true;
        }

        const runner = runtime.getRunner(app);
        if (runner instanceof AwsLambdaRunnerInterface) {
            runner.setEvent(event);
            runner.setContext(context);
            runner.setStreamingResponse(streamingResponse);
        }

        await runner.run();
    });
};
