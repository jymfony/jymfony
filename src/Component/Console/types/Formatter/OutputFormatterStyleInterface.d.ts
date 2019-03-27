declare namespace Jymfony.Component.Console.Formatter {
    export class OutputFormatterStyleInterface implements MixinInterface {
        public static readonly definition: Newable<OutputFormatterStyleInterface>;

        /**
         * Sets style foreground color.
         */
        public /* writeonly */ foreground: string;

        /**
         * Sets style background color.
         */
        public /* writeonly */ background: string;

        /**
         * Sets link href.
         */
        public /* writeonly */ href: string;

        /**
         * Sets some specific style option.
         */
        setOption(option: string): void;

        /**
         * Unsets some specific style option.
         */
        unsetOption(option: string): void;

        /**
         * Sets multiple style options at once.
         */
        setOptions(options: string[]): void;

        /**
         * Applies the style to a given text.
         */
        apply(text: string): string;
    }
}
