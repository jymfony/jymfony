declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    /**
     * Base class for Accept headers.
     */
    export abstract class BaseAccept {
        protected _type: string;
        private _quality: number;
        private _normalized: string;
        private _value: string;
        private _parameters: Record<string, any>;

        /**
         * Constructor.
         */
        __construct(value: string): void;
        constructor(value: string);

        /**
         * The normalized value.
         */
        public readonly normalizedValue: string;

        /**
         * The raw value.
         */
        public readonly value: string;

        /**
         * The type.
         */
        public readonly type: string;

        /**
         * The accept quality.
         */
        public readonly quality: number;

        /**
         * The accept header parameters.
         */
        public readonly parameters: Record<string, any>;

        /**
         * Gets a specific parameter.
         */
        getParameter(key: string, defaultValue?: any): string | any;

        /**
         * Whether the accept header has the specified parameter.
         */
        hasParameter(key: string): boolean;

        /**
         * Parses the accept part parameters.
         */
        private _parseParameters(acceptPart: string): [string, Record<string, string>];

        /**
         * Builds a parameters string.
         */
        private _buildParametersString(parameters: Record<string, string>): string;
    }
}
