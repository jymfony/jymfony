declare namespace Jymfony.Component.Templating.View {
    import EngineInterface = Jymfony.Component.Templating.Engine.EngineInterface;
    import HelperInterface = Jymfony.Component.Templating.Helper.HelperInterface;
    import TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

    class View {
        private _output: NodeJS.WritableStream;
        private _name: string | TemplateReferenceInterface;
        private _engine: EngineInterface;
        private _parameters: Record<string, any>;
        private _helpers: Record<string, HelperInterface>;
        private _escapers: Record<string, Invokable<string>>;
        private _slots: Record<string, __jymfony.StreamBuffer>;
        private _currentSlot: string;
        private _parent: string | undefined;
        private _emitted: boolean;
        private _escaperCache: Record<string, Record<string, string>>;

        /**
         * Constructor.
         */
        __construct(output: NodeJS.WritableStream, name: string | TemplateReferenceInterface, engine: EngineInterface, parameters?: Record<string, any>): void;
        constructor(output: NodeJS.WritableStream, name: string | TemplateReferenceInterface, engine: EngineInterface, parameters?: Record<string, any>);

        /**
         * Gets an helper.
         */
        getHelper(name: string): HelperInterface;

        /**
         * Escapes a string.
         *
         * @param value A variable to escape
         * @param context The context name
         *
         * @returns The escaped value
         */
        escape(value: any, context?: string): string;

        /**
         * Gets an escaper for a given context.
         *
         * @throws {InvalidArgumentException}
         */
        getEscaper(context: string): Invokable<string>;

        /**
         * Streams the view to the client.
         */
        stream(): Promise<void>;

        /**
         * Extends another template.
         */
        extend(name: string | TemplateReferenceInterface): Promise<void>;

        /**
         * Do the stream operation.
         */
        private _doStream(name: string | TemplateReferenceInterface): Promise<void>;

        /**
         * Outputs the value.
         */
        private _out(buffer: string | Buffer): Promise<void>;
    }
}
