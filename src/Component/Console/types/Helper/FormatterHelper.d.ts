declare namespace Jymfony.Component.Console.Helper {
    export class FormatterHelper extends Helper {
        /**
         * Formats a message within a section.
         *
         * @param section The section name
         * @param message The message
         * @param [style = 'info'] The style to apply to the section
         *
         * @returns The format section
         */
        formatSection(section: string, message: string, style?: string): string;

        /**
         * Formats a message as a block of text.
         *
         * @param messages The message to write in the block
         * @param style The style to apply to the whole block
         * @param [large = false] Whether to return a large block
         *
         * @returns The formatter message
         */
        formatBlock(messages: string|string[], style: string, large?: boolean): string;

        /**
         * Truncates a message to the given length.
         */
        truncate(message: string, length: number, suffix?: string): string;
    }
}
