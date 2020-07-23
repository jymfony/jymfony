declare namespace Jymfony.Component.Console.Input {
    export class InputOption {
        public static readonly VALUE_NONE = 1;
        public static readonly VALUE_REQUIRED = 2;
        public static readonly VALUE_OPTIONAL = 4;
        public static readonly VALUE_IS_ARRAY = 8;

        private _name: string;
        private _shortcut: string;
        private _mode: number;
        private _description: string|undefined;
        private _default: any;

        /**
         * Constructor
         */
        constructor(name: string, shortcut?: string|string[]|undefined, mode?: number|undefined, description?: string, defaultValue?: any);
        __construct(name: string, shortcut?: string|string[]|undefined, mode?: number|undefined, description?: string, defaultValue?: any): void;

        /**
         * Gets the shortcut(s).
         */
        getShortcut(): string;

        /**
         * Gets the name.
         */
        getName(): string;

        /**
         * Returns true if the option accepts a value.
         */
        acceptValue(): boolean;

        /**
         * Whether the option value is required or not.
         */
        isValueRequired(): boolean;

        /**
         * Whether the option value is optional or not.
         */
        isValueOptional(): boolean;

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
         * Gets the option description.
         */
        getDescription(): string;

        /**
         * Whether this option equals another option
         */
        equals(option: InputOption): boolean;
    }
}
