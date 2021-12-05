const { resolve } = require('path');

try {
    require('@jymfony/autoloader');
} catch (e) {
    process.env.LAMBDA_TASK_ROOT = resolve(__dirname + '/../../../../../');
    require('../../../../Component/Autoloader');
}

const TestServer = Jymfony.Contracts.Fixtures.HttpClient.TestServer;
(async () => {
    const server = TestServer.createHttpServer(process.argv[2]);
    process.on('message', () => server.close());

    await server;
})().then(() => {}, console.error);
