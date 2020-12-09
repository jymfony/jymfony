declare namespace Jymfony.Component.HttpClient {
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

        /**
         * @private
         */
        private _initialize(): Promise<void>;

        /**
         * @private
         */
        private _checkStatusCode(): void;
    }
}
