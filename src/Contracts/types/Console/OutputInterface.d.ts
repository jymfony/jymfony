declare namespace Jymfony.Contracts.Console {
    export class OutputInterface implements MixinInterface {
        public static readonly definition: Newable<OutputInterface>;

        public static readonly VERBOSITY_QUIET = 16;
        public static readonly VERBOSITY_NORMAL = 32;
        public static readonly VERBOSITY_VERBOSE = 64;
        public static readonly VERBOSITY_VERY_VERBOSE = 128;
        public static readonly VERBOSITY_DEBUG = 256;

        public static readonly OUTPUT_NORMAL = 1;
        public static readonly OUTPUT_RAW = 2;
        public static readonly OUTPUT_PLAIN = 4;

        /**
         * Gets/sets the decorated flag.
         */
        public decorated: boolean;

        /**
         * Gets/sets the verbosity of the output (one of the VERBOSITY constants).
         */
        public verbosity: number;

        /**
         * Writes a message to the output.
         *
         * @param messages The message as an array of lines or a single string
         * @param [newline = false]  Whether to add a newline
         * @param [options = 0]  A bitmask of options (one of the OUTPUT or VERBOSITY constants), 0 is considered the same as self::OUTPUT_NORMAL | self::VERBOSITY_NORMAL
         */
        write(messages: string|string[], newline?: boolean, options?: number): void;

        /**
         * Writes a message to the output and adds a newline at the end.
         *
         * @param [messages = ''] The message as an array of lines of a single string
         * @param [options = 0] A bitmask of options (one of the OUTPUT or VERBOSITY constants), 0 is considered the same as self::OUTPUT_NORMAL | self::VERBOSITY_NORMAL
         */
        writeln(messages?: string|string[], options?: number): void;

        /**
         * Returns whether verbosity is quiet (-q).
         */
        isQuiet(): boolean;

        /**
         * Returns whether verbosity is verbose (-v).
         */
        isVerbose(): boolean;

        /**
         * Returns whether verbosity is very verbose (-vv).
         */
        isVeryVerbose(): boolean;

        /**
         * Returns whether verbosity is debug (-vvv).
         */
        isDebug(): boolean;
    }
}
