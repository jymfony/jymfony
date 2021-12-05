declare namespace Jymfony.Component.HttpClient.Response {
    export class CommonResponseTrait {
        private _decodedData: any;

        __construct(): void;

        /**
         * @inheritdoc
         */
        getStatusCode(): number;

        /**
         * @inheritdoc
         */
        getDecodedContent(Throw?: boolean): Promise<any>;

        private _initialize(): Promise<void>;
        private _pipeline<T extends NodeJS.WritableStream>(input: NodeJS.ReadableStream, output: T): typeof output;
        private _checkStatusCode(): void;
    }
}
