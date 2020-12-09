const { resolve } = require('path');

try {
    require('@jymfony/autoloader');
} catch (e) {
    process.env.LAMBDA_TASK_ROOT = resolve(__dirname + '/../../../../../');
    require('../../../../Component/Autoloader');
}

const TestServer = Jymfony.Contracts.Fixtures.HttpClient.TestServer;
(async () => {
    await TestServer.createHttpServer(process.argv[2]);
})().then(() => {}, console.error);
