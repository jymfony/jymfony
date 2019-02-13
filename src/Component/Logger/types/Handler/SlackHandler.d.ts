declare namespace Jymfony.Component.Logger.Handler {
    import SlackRecord = Jymfony.Component.Logger.Handler.Slack.SlackRecord;
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    interface SlackHandlerOptions extends SlackOptions {
        token: string;
    }

    export class SlackHandler extends SocketHandler {
        private _token: string;
        private _slackRecord: SlackRecord;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(options: SlackHandlerOptions, level?: number, bubble?: boolean): void;
        constructor(options: SlackHandlerOptions, level?: number, bubble?: boolean);

        /**
         * @inheritdoc
         */
        protected _generateDataStream(record: LogRecord): string;

        /**
         * @inheritdoc
         */
        public formatter: FormatterInterface;
    }
}
