declare namespace Jymfony.Component.Routing {
    export class CompiledRoute {
        private _staticPrefix: string;
        private _regex: RegExp;
        private _tokens: string[][];
        private _pathVariables: string[];
        private _hostRegex: RegExp;
        private _hostTokens: string[][];
        private _hostVariables: string[];
        private _variables: string[];

        /**
         * Constructor.
         */
        __construct(staticPrefix: string, regex: RegExp, tokens: string[][], pathVariables: string[], hostRegex: RegExp, hostTokens: string[][], hostVariables: string[], variables: string[]): void;
        constructor(staticPrefix: string, regex: RegExp, tokens: string[][], pathVariables: string[], hostRegex: RegExp, hostTokens: string[][], hostVariables: string[], variables: string[]);

        public readonly staticPrefix: string;

        /**
         * Gets the compiled RegExp for path.
         */
        public readonly regex: RegExp;

        /**
         * Gets the compiled RegExp for host.
         *
         * @returns {RegExp}
         */
        public readonly hostRegex: RegExp;

        public readonly tokens: string[][];

        public readonly variables: string[];

        public readonly hostTokens: string[][];

        public readonly pathVariables: string[];

        public readonly hostVariables: string[];
    }
}
