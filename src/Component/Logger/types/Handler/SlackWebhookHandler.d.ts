declare namespace Jymfony.Component.Logger.Handler {
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;
    import SlackRecord = Jymfony.Component.Logger.Handler.Slack.SlackRecord;

    interface SlackWebhookHandlerOptions extends SlackOptions {
        webhookUrl: string;
    }

    export class SlackWebhookHandler extends AbstractProcessingHandler {
        private _slackRecord: SlackRecord;
        private _webhookUrl: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(options: SlackWebhookHandlerOptions, level?: number, bubble?: boolean): void;
        constructor(options: SlackWebhookHandlerOptions, level?: number, bubble?: boolean);

        /**
         * @inheritdoc
         */
        public formatter: FormatterInterface;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;
    }
}
