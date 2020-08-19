declare namespace Jymfony.Component.Logger.Handler {
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    export class FormattableHandlerTrait {
        public static readonly definition: Newable<FormattableHandlerTrait>;
        private _formatter: FormatterInterface;

        /**
         * Constructor.
         */
        __construct(): void;

        /**
         * Gets/sets the formatter.
         */
        public formatter: FormatterInterface;
    }
}
