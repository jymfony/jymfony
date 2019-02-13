declare namespace Jymfony.Component.HttpServer.Serverless {
    import ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    export class AwsLambdaHandler extends RequestHandler {
        /**
         * Creates a new Http server instance.
         */
        static create(routes: RouteCollection, logger?: LoggerInterface): AwsLambdaHandler;

        /**
         * Handles an incoming request from the http server.
         */
        handleEvent(event: APIGatewayProxyEvent | ALBEvent, context: Context): Promise<APIGatewayProxyResult | ALBResult>;

        /**
         * Converts an IncomingMessage to an HttpFoundation request
         * and sends it to the Kernel.
         */
        protected _handleRequest(event: APIGatewayProxyEvent | ALBEvent, context: Context): Promise<APIGatewayProxyResult | ALBResult>;

        /**
         * @inheritdoc
         */
        protected _parseRequestContent(stream: NodeJS.ReadableStream, headers: Record<string, string>, contentType: ContentType): Promise<[any, Buffer | undefined]>;

        /**
         * @inheritdoc
         */
        protected _getScheme(headers: Record<string, any>): string;
    }
}
