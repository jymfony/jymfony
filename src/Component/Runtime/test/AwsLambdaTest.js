import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const DateTime = Jymfony.Component.DateTime.DateTime;
const HttpClient = Jymfony.Component.HttpClient.HttpClient;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const LAMBDA_IMAGE = 'public.ecr.aws/lambda/nodejs:18.2023.11.10.17';

export default class AwsLambdaTest extends TestCase {
    /**
     * @type {Jymfony.Contracts.HttpClient.HttpClientInterface}
     */
    static client = HttpClient.create();

    /**
     * @type {boolean}
     */
    static standalone = (() => {
        try {
            require.resolve('@jymfony/autoloader');
            return true;
        } catch {
            return false;
        }
    })();

    get testCaseName() {
        return '[Runtime] ' + super.testCaseName;
    }

    before() {
        try {
            execSync('docker pull ' + LAMBDA_IMAGE, { stdio: 'ignore' });
        } catch (e) {
            __self.markTestSkipped(e.stack || e.message);
        }
    }

    static async start(handler) {
        const id = execSync(
            __jymfony.sprintf(
                'docker create -q --rm -v "%s" -p 9000:8080 -it %s %s',
                resolve(__dirname + '/..' + (__self.standalone ? '' : '/../../..')) + ':/var/task',
                LAMBDA_IMAGE,
                (__self.standalone ? '' : 'src/Component/Runtime/') + 'fixtures/' + handler,
            ),
        ).toString();
        execSync('docker start ' + id);
        await __jymfony.sleep(1000);

        return id;
    }

    static async stop(containerId) {
        try {
            execSync('docker stop ' + containerId);
            await __jymfony.sleep(1000);
        } catch {
            // Do nothing
        }
    }

    async testShouldHandleLambdaEventCorrectly() {
        const containerId = await __self.start('lambda-integration.handler');
        try {
            const response = __self.client.request('POST', 'http://localhost:9000/2015-03-31/functions/function/invocations', {
                json: {
                    content: 'This is the event content',
                },
            });

            const resp = JSON.parse((await response.getContent()).toString());
            __self.assertEquals('This is the event content', resp.content);
        } finally {
            await __self.stop(containerId);
        }
    }

    async testShouldRespondeWithStreamingResponse() {
        const containerId = await __self.start('lambda-integration.streamHandler');
        try {
            const response = __self.client.request('POST', 'http://localhost:9000/2015-03-31/functions/function/invocations', {
                json: {
                    version: '2.0',
                    routeKey: '$default',
                    rawPath: '/',
                    rawQueryString: '',
                    cookies: [],
                    headers: {},
                    queryStringParameters: {},
                    requestContext: {
                        accountId: '123456789012',
                        apiId: 'xxxxxx',
                        authentication: null,
                        authorizer: null,
                        domainName: 'example.lambda-url.us-west-2.on.aws',
                        domainPrefix: '0000',
                        http: {
                            method: 'POST',
                            path: '/',
                            protocol: 'HTTP/1.1',
                            sourceIp: '127.0.0.1',
                            userAgent: 'agent',
                        },
                        requestId: 'id',
                        routeKey: '$default',
                        stage: '$default',
                        time: DateTime.now.format('d/M/Y:H:i:s P'),
                        timeEpoch: DateTime.now.timestamp,
                    },
                    body: 'This is the body',
                    pathParameters: null,
                    isBase64Encoded: false,
                    stageVariables: null,
                },
            });

            const content = await response.getContent();
            const preludeEnd = content.indexOf(new Uint8Array(8));
            __self.assertNotUndefined(preludeEnd);

            const prelude = JSON.parse(content.slice(0, preludeEnd).toString());
            const resp = JSON.parse(content.slice(preludeEnd + 8).toString());

            __self.assertEquals(200, prelude.statusCode);
            __self.assertEquals('application/json', prelude.headers['content-type']);
            __self.assertEquals('This is the body', resp.content);
        } finally {
            await __self.stop(containerId);
        }
    }
}
