declare namespace Jymfony.Component.Console.Input {
    export class InputArgument {
        public static readonly REQUIRED = 1;
        public static readonly OPTIONAL = 2;
        public static readonly IS_ARRAY = 4;

        private _name: string;
        private _mode: number;
        private _description: string|undefined;
        private _default: any;

        /**
         * Constructor.
         */
        __construct(name: string, mode?: number|undefined, description?: string, defaultValue?: any): void;
        constructor(name: string, mode?: number|undefined, description?: string, defaultValue?: any);

        /**
         * Gets the name.
         */
        getName(): string;

        /**
         * Whether the argument is required or not.
         */
        isRequired(): boolean;

        /**
         * Whether the argument is an array.
         */
        isArray(): boolean;

        /**
         * Sets the default value
         *
         * @throws {Jymfony.Component.Console.Exception.LogicException} If the argument is required
         */
        setDefault(defaultValue: any): void;

        /**
         * Gets the default value.
         */
        getDefault(): any;

        /**
         * Gets the argument description.
         */
        getDescription(): string;
    }
}
