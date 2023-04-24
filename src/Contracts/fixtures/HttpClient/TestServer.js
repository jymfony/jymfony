const HttpServer = Jymfony.Component.HttpServer.HttpServer;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const Response = Jymfony.Component.HttpFoundation.Response;
const Route = Jymfony.Component.Routing.Route;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

class CompressableResponse extends Response {
    set encoding(value) {
        if (value) {
            this._encoding = 'gzip';
            this.headers.set('Content-Encoding', 'gzip');
        } else {
            this._encoding = undefined;
            this.headers.remove('Content-Encoding');
        }
    }

    // eslint-disable-next-line no-unused-vars
    _setEncodingForCompression(request) {
        // Do nothing
    }
}

const generateController = port =>
    /**
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    async request => {
        const serializedRequest = request.toJson();
        const authorization = request.headers.get('Authorization', '');
        if (authorization.startsWith('Basic ')) {
            const [ username, password ] = Buffer.from(authorization.substring(6), 'base64').toString().split(':');
            serializedRequest.username = username;
            serializedRequest.password = password || '';
        }

        if (request.query.length) {
            serializedRequest.query = request.query.all;
        }

        const json = JSON.stringify(serializedRequest);
        const response = new CompressableResponse(json, Response.HTTP_OK, {
            'Content-Type': 'application/json',
            Host: request.httpHost,
        });

        const route = request.attributes.get('route');
        switch (route) {
            default:
                return new Response();

            case 'head':
                response.headers.set('Content-Length', String(json.length));
                break;

            case '':
                response.encoding = true;
                response.setVary('Accept-Encoding', false);
                break;

            case '103':
                return new class InformationalResponse extends Response {
                    async sendResponse(req, res) {
                        res._writeRaw(
                            'HTTP/1.1 103 Early Hints\r\n' +
                            'Link: </style.css>; rel=preload; as=style\r\n' +
                            'Link: </script.js>; rel=preload; as=style\r\n' +
                            '\r\n'
                        );

                        res.writeHead(200, 'OK', {
                            'Date': 'Fri, 26 May 2017 10:02:11 GMT',
                            'Content-Length': '13',
                        });
                        res.end('Here the body');
                    }
                }();

            case '404':
                response.setStatusCode(404);
                break;

            case '/404-gzipped':
                response.setStatusCode(404);
                response.headers.set('Content-Type', 'text/plain');
                response.encoding = true;
                response.content = 'some text';
                break;

            case '301':
                if ('Basic Zm9vOmJhcg==' === request.headers.get('Authorization')) {
                    response.headers.set('Location', 'http://127.0.0.1:' + port + '/302');
                    response.setStatusCode(301);
                }
                break;

            case '301/bad-tld':
                response.headers.set('Location', 'http://foo.example.');
                response.setStatusCode(301);
                break;

            case '301/invalid':
                response.headers.set('Location', '//?foo=bar');
                response.setStatusCode(301);
                break;

            case '302':
                if (! request.headers.has('Authorization')) {
                    response.headers.set('Location', 'http://localhost:' + port + '/');
                    response.setStatusCode(302);
                }
                break;

            case '302/relative':
                response.headers.set('Location', '..');
                response.setStatusCode(302);
                break;

            case '304':
                response.headers.set('Content-Length', '10');
                response.setStatusCode(304);
                response.content = '12345';
                break;

            case '307':
                response.headers.set('Location', 'http://localhost:' + port + '/post');
                response.setStatusCode(307);
                break;

            case 'length-broken':
                response.headers.set('Content-Length', '1000');
                break;

            case 'post': {
                const content = { ...request.request.all, REQUEST_METHOD: request.method };
                const contentType = request.headers.get('content-type', '');
                if (contentType.includes('json')) {
                    content['content-type'] = request.headers.get('content-type', '');
                }

                response.content = JSON.stringify(content, null, 4);
                response.headers.set('Content-Length', String(response.content.length));
            } break;

            case 'timeout-header':
                await __jymfony.sleep(30000);
                break;

            case 'timeout-body':
                response.content = async (res) => {
                    res.write('<1>');
                    await __jymfony.sleep(50000);
                    res.write('<2>');
                };
                break;

            case 'chunked':
                response.headers.set('Transfer-Encoding', 'chunked');
                response.content = res => {
                    res.write('');
                    res.write('8\r\nJymfony \r\n5\r\nis aw\r\n6\r\nesome!\r\n0\r\n\r\n');
                };
                break;

            case 'chunked-broken':
                response.headers.set('Transfer-Encoding', 'chunked');
                response.content = res => {
                    res.write('8\r\nJymfony \r\n5\r\nis aw\r\n6\r\ne');
                };
                break;

            case 'gzip-broken':
                response.headers.set('Content-Encoding', 'gzip');
                response.content = res => {
                    res.write('-'.repeat(1000));
                };
                break;

            case 'json':
                response.content = JSON.stringify({
                    documents: [
                        { id: '/json/1' },
                        { id: '/json/2' },
                        { id: '/json/3' },
                    ],
                });
                break;

            case 'json/1':
            case 'json/2':
            case 'json/3':
                response.content = JSON.stringify({
                    title: request.uri,
                });
                break;

            case 'long-file':
                response.content = Buffer.allocUnsafeSlow(80 * 1024).toString('base64');
                break;

            case 'long-file-compressed':
                response.content = Buffer.allocUnsafeSlow(80 * 1024).toString('base64');
                response.encoding = true;
                break;
        }

        return response;
    };

/**
 * @memberOf Jymfony.Contracts.Fixtures.HttpClient
 */
export default class TestServer {
    static createHttpServer(port) {
        const collection = new RouteCollection();
        collection.add('route', new Route(
            '{route}',
            { _controller: generateController(port) },
            { route: /.*/ },
        ));

        const server = HttpServer.create(collection);
        server.eventDispatcher.addListener(HttpServerEvents.EXCEPTION, console.error);

        const promise = server.listen({ port });
        promise.close = server.close.bind(server);

        return promise;
    }
}
