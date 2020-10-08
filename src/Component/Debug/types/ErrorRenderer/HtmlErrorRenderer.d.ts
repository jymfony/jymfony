declare namespace Jymfony.Component.Debug.ErrorRenderer {
    import FlattenException = Jymfony.Component.Debug.Exception.FlattenException;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    export class HtmlErrorRenderer extends implementationOf(ErrorRendererInterface) {
        private _debug: boolean | Function;
        private _projectDir: string;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         */
        __construct(debug?: boolean | Function, projectDir?: null | string, logger?: LoggerInterface): void;
        constructor(debug?: boolean | Function, projectDir?: null | string, logger?: LoggerInterface);

        /**
         * @inheritdoc
         */
        render(exception: Error): FlattenException;

        /**
         * Gets the HTML content associated with the given exception.
         */
        getBody(exception: FlattenException): string;

        /**
         * Gets the stylesheet associated with the given exception.
         */
        getStylesheet(): string;

        static isDebug(request: RequestInterface, debug: boolean): () => boolean;

        /**
         * Renders a template for the given exception.
         */
        private _renderException(exception: FlattenException, debugTemplate?: string): string;

        /**
         * Formats a file path.
         */
        private _formatFile(file: string, line: number, text?: string): string;

        /**
         * Returns an excerpt of a code file around the given line number.
         */
        private _fileExcerpt(file: string, line: number, srcContext?: number): string;

        private _escape(string: string): string;
        private _abbrClass(klass: string): string;
        private _getFileRelative(file: string): null | string;
        private _formatLogMessage(message: string, context: any): string;
        private _addElementToGhost(): string;
        private _include(name: string, context?: any): string;
    }
}
