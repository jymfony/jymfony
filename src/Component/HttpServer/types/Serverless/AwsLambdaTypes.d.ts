declare namespace Jymfony.Component.HttpServer.Serverless {
    interface CognitoIdentity {
        cognitoIdentityId: string;
        cognitoIdentityPoolId: string;
    }

    interface ClientContextClient {
        installationId: string;
        appTitle: string;
        appVersionName: string;
        appVersionCode: string;
        appPackageName: string;
    }

    interface ClientContextEnv {
        platformVersion: string;
        platform: string;
        make: string;
        model: string;
        locale: string;
    }

    export interface ClientContext {
        client: ClientContextClient;
        custom?: any;
        env: ClientContextEnv;
    }

    interface ALBEventRequestContext {
        elb: {
            targetGroupArn: string;
        };
    }

    interface ALBEvent {
        requestContext: ALBEventRequestContext;
        httpMethod: string;
        path: string;
        queryStringParameters?: { [parameter: string]: string }; // URL encoded
        headers?: { [header: string]: string };
        multiValueQueryStringParameters?: { [parameter: string]: string[] }; // URL encoded
        multiValueHeaders?: { [header: string]: string[] };
        body: string | null;
        isBase64Encoded: boolean;
    }

    interface APIGatewayEventRequestContext {
        accountId: string;
        apiId: string;
        authorizer?: Record<string, boolean | number | string> | null;
        connectedAt?: number;
        connectionId?: string;
        domainName?: string;
        eventType?: string;
        extendedRequestId?: string;
        httpMethod: string;
        identity: {
            accessKey: string | null;
            accountId: string | null;
            apiKey: string | null;
            apiKeyId: string | null;
            caller: string | null;
            cognitoAuthenticationProvider: string | null;
            cognitoAuthenticationType: string | null;
            cognitoIdentityId: string | null;
            cognitoIdentityPoolId: string | null;
            sourceIp: string;
            user: string | null;
            userAgent: string | null;
            userArn: string | null;
        };
        messageDirection?: string;
        messageId?: string | null;
        path: string;
        stage: string;
        requestId: string;
        requestTime?: string;
        requestTimeEpoch: number;
        resourceId: string;
        resourcePath: string;
        routeKey?: string;
    }

    interface APIGatewayProxyEvent {
        body: string | null;
        headers: { [name: string]: string };
        multiValueHeaders: { [name: string]: string[] };
        httpMethod: string;
        isBase64Encoded: boolean;
        path: string;
        pathParameters: { [name: string]: string } | null;
        queryStringParameters: { [name: string]: string } | null;
        multiValueQueryStringParameters: { [name: string]: string[] } | null;
        stageVariables: { [name: string]: string } | null;
        requestContext: APIGatewayEventRequestContext;
        resource: string;
    }

    interface Context {
        // Properties
        callbackWaitsForEmptyEventLoop: boolean;
        functionName: string;
        functionVersion: string;
        invokedFunctionArn: string;
        memoryLimitInMB: number;
        awsRequestId: string;
        logGroupName: string;
        logStreamName: string;
        identity?: CognitoIdentity;
        clientContext?: ClientContext;

        // Functions
        getRemainingTimeInMillis(): number;

        // Functions for compatibility with earlier Node.js Runtime v0.10.42
        // For more details see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-using-old-runtime.html#nodejs-prog-model-oldruntime-context-methods
        done(error?: Error, result?: any): void;
        fail(error: Error | string): void;
        succeed(messageOrObject: any): void;
        succeed(message: string, object: any): void;
    }

    interface APIGatewayProxyResult {
        statusCode: number;
        headers?: {
            [header: string]: boolean | number | string;
        };
        multiValueHeaders?: {
            [header: string]: Array<boolean | number | string>;
        };
        body: string;
        isBase64Encoded?: boolean;
    }

    interface ALBResult {
        statusCode: number;
        statusDescription: string;
        headers?: { [header: string]: boolean | number | string };
        multiValueHeaders?: { [header: string]: Array<boolean | number | string> };
        body: string;
        isBase64Encoded: boolean;
    }
}
