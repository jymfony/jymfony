declare namespace Jymfony.Component.HttpServer.Serverless {
    import ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class AwsLambdaHandler extends RequestHandler {
        /**
         * Creates a new Http server instance.
         */
        static create(routes: RouteCollection, logger?: LoggerInterface): AwsLambdaHandler;

        /**
         * Handles an incoming request from the http server.
         */
        handleEvent(event: APIGatewayProxyEvent | ALBEvent, context: Context): Promise<APIGatewayProxyResult | ALBResult | void>;

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

        /**
         * Prepare streaming response object.
         */
        private _handleStreamedResponse(request: Request, response: Response, event: APIGatewayProxyEvent | ALBEvent, responseStream: LambdaResponseStream): Promise<void>;

        /**
         * Prepare buffered response object.
         */
        private _handleBufferedResponse(request: Request, response: Response, event: APIGatewayProxyEvent | ALBEvent): Promise<APIGatewayProxyResult | ALBResult>;
        private _prepareHeaders(event: APIGatewayProxyEvent | ALBEvent, response: Response): Record<string, any>;
    }
}
