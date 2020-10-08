declare namespace Jymfony.Component.Dotenv {
    /**
     * Manages .env files.
     */
    export class Dotenv {
        static VARNAME_REGEX: string;
        static STATE_VARNAME: number;
        static STATE_VALUE: number;

        private _path: string;
        private _cursor: number;
        private _lineno: number;
        private _data: string;
        private _end: number;
        private _values: Record<string, string>;
        private _envKey: string;
        private _debugKey: string;
        private _prodEnvs: string[];

        /**
         * Constructor.
         */
        __construct(envKey?: string, debugKey?: string): void;
        constructor(envKey?: string, debugKey?: string);

        /**
         * Sets the prod environment names.
         */
        setProdEnvs(prodEnvs: string[]): this;

        /**
         * Loads one or several .env files.
         *
         * @param path A file to load
         * @param extraPaths A list of additional files to load
         *
         * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
         * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
         */
        load(path: string, ...extraPaths: string[]): void;

        /**
         * Loads a .env file and the corresponding .env.local, .env.$env and .env.$env.local files if they exist.
         *
         * .env.local is always ignored in test env because tests should produce the same results for everyone.
         * .env.dist is loaded when it exists and .env is not found.
         *
         * @param {string} path A file to load
         * @param {string|null} envKey The name of the env vars that defines the app env
         * @param {string} defaultEnv The app env to use when none is defined
         * @param {string[]} testEnvs A list of app envs for which .env.local should be ignored
         *
         * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
         * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
         */
        loadEnv(path: string, envKey?: string | null, defaultEnv?: string, testEnvs?: string[]): void;

        /**
         * Loads env vars from .env.local.js if the file exists or from the other .env files otherwise.
         *
         * This method also configures the APP_DEBUG env var according to the current APP_ENV.
         *
         * See method loadEnv() for rules related to .env files.
         */
        bootEnv(path: string, defaultEnv?: string, testEnvs?: string[]): void;

        /**
         * Loads one or several .env files and enables override existing vars.
         *
         * @param path A file to load
         * @param extraPaths A list of additional files to load
         *
         * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
         * @throws {Jymfony.Component.Dotenv.Exception.PathException} when a file does not exist or is not readable
         */
        overload(path: string, ...extraPaths: string[]): void;

        /**
         * Sets values as environment variables.
         *
         * @param values An array of env variables
         * @param overrideExistingVars true when existing environment variables must be overridden
         */
        populate(values: Record<string, string>, overrideExistingVars?: boolean): void;

        /**
         * Parses the contents of an .env file.
         *
         * @param data The data to be parsed
         * @param path The original file name where data where stored (used for more meaningful error messages)
         *
         * @returns An array of env variables
         *
         * @throws {Jymfony.Component.Dotenv.Exception.FormatException} when a file has a syntax error
         */
        parse(data: string | Buffer, path?: string): Record<string, string>;

        private _lexVarname(): string;
        private _lexValue(): string;
        private _lexNestedExpression(): string;

        private _skipEmptyLines(): void;

        private _resolveCommands(value: string, loadedVars: Record<string, string>): string;
        private _resolveVariables(value: string, loadedVars: Record<string, string>): string;

        private _moveCursor(text: string): void;

        private _createFormatException(message: string): Jymfony.Component.Dotenv.Exception.FormatException;

        /**
         * Do load env variables
         */
        private _doLoad(overrideExistingVars: boolean, paths: string[]): void;
    }
}
