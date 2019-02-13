declare namespace Jymfony.Component.Console.Helper {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    /**
     * Contains helper methods to format strings and values
     */
    export class Helper {
        static formatTime(secs: number): string;

        static formatMemory(memory: number): string;

        static strlenWithoutDecoration(formatter: OutputFormatterInterface, string: string): number;

        /**
         * Removes decoration from output string
         */
        static removeDecoration(formatter: OutputFormatterInterface, string: string): string;
    }
}
