const { resolve } = require('path');

try {
    process.env.LAMBDA_TASK_ROOT = resolve(__dirname + '/../../../../../../');
    require('@jymfony/autoloader');
    Jymfony.Contracts.Fixtures = new Jymfony.Component.Autoloader.Namespace(__jymfony.autoload, 'Jymfony.Contracts.Fixtures', [ __dirname + '/../../../fixtures' ]);
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
