declare namespace Jymfony.Component.Console.Input {
    export class Input extends implementationOf(StreamableInputInterface) {
        public interactive: boolean;
        public stream: NodeJS.ReadableStream;

        protected _arguments: Record<string, any>;
        protected _options: Record<string, any>;
        private _interactive: boolean;
        private _stream: NodeJS.ReadableStream;

        /**
         * Constructor.
         */
        __construct(definition?: InputDefinition): void;
        constructor(definition?: InputDefinition);

        /**
         * @inheritdoc
         */
        bind(definition: InputDefinition): void;

        /**
         * Parses the options and arguments.
         */
        parse(): void;

        /**
         * @inheritdoc
         */
        validate(): void;

        /**
         * @inheritdoc
         */
        public readonly arguments: Record<string, any>;

        /**
         * @inheritdoc
         */
        getArgument(name: string): any;

        /**
         * @inheritdoc
         */
        setArgument(name: string, value: any): void;

        /**
         * @inheritdoc
         */
        hasArgument(name: string): boolean;

        /**
         * @inheritdoc
         */
        public readonly options: Record<string, any>;

        /**
         * @inheritdoc
         */
        getOption(name: string): any;

        /**
         * @inheritdoc
         */
        setOption(name: string, value: any): void;

        /**
         * @inheritdoc
         */
        hasOption(name: string): boolean;

        /**
         * Escapes a token through escapeshellarg if it contains unsafe chars.
         */
        escapeToken(token: string): string;
    }
}
