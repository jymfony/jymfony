declare namespace Jymfony.Component.Autoloader.Parser.SourceMap {
    export class StackHandler {
        /**
         * Prepares stack trace using V8 stack trace API.
         */
        static prepareStackTrace(error: Error, stack: NodeJS.CallSite[]): string;

        /**
         * Registers a source map.
         */
        static registerSourceMap(filename: string, mappings: string): void;
    }
}
