declare namespace Jymfony.Component.Console.Formatter {
    export class OutputFormatterInterface implements MixinInterface {
        public static readonly definition: Newable<OutputFormatterInterface>;

        /**
         * Gets/sets the decorated flag.
         */
        public decorated: boolean;

        /**
         * Sets a new style.
         */
        setStyle(name: string, style: OutputFormatterStyleInterface): void;

        /**
         * Checks if output formatter has style with specified name.
         */
        hasStyle(name: string): boolean;

        /**
         * Gets style options from style with specified name.
         */
        getStyle(name: string): OutputFormatterStyleInterface;

        /**
         * Formats a message according to the given styles.
         */
        format(message: string): string;

        /**
         * Formats a message according to the given styles, wrapping at `width` (0 means no wrapping).
         */
        formatAndWrap(message: string, width: number): string;
    }
}
