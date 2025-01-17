try {
    require('@jymfony/autoloader');
} catch {
    require('../../Autoloader');
}

const { lambda, streamingResponse } = require('../lambda');

exports.handler = lambda(function () {
    return async function (event) {
        return event;
    };
});

exports.streamHandler = streamingResponse(async function () {
    const AwsLambdaHandler = Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler;
    const JsonResponse = Jymfony.Component.HttpFoundation.JsonResponse;
    const Route = Jymfony.Component.Routing.Route;
    const RouteCollection = Jymfony.Component.Routing.RouteCollection;

    const collection = new RouteCollection();
    collection.add('route', new Route(
        '{route}',
        { _controller: function (request) {
            return new JsonResponse({
                query: request.query.all,
                request: request.request.all,
                content: request.content.toString(),
            });
        } },
        { route: /.*/ },
    ));

    return AwsLambdaHandler.create(collection);
});
