declare namespace Jymfony.Component.Logger.Handler.Slack {
import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;
import NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;

export class SlackRecord {
    public static readonly COLOR_DANGER = 'danger';
    public static readonly COLOR_WARNING = 'warning';
    public static readonly COLOR_GOOD = 'good';
    public static readonly COLOR_DEFAULT = '#e3e4e6';

    /**
     * Slack channel (encoded ID or name).
     */
    private _channel: string;

    /**
     * Name of the bot.
     */
    private _username: string;

    /**
     * Whether the message should be added to Slack as an attachment (plain text otherwise).
     */
    private _useAttachment: boolean;

    /**
     * User icon (emoji name or url).
     */
    private _userIcon: string;

    /**
     * Whether to context should be added as short attachment.
     */
    private _useShortAttachment: boolean;

    /**
     * Whether context and extra should be included.
     */
    private _includeContextAndExtra: boolean;

    /**
     * List of fields to be excluded
     */
    private _excludeFields: string[];

    /**
     * Record formatter.
     */
    public formatter: FormatterInterface;
    private _normalizerFormatter: NormalizerFormatter;

    /**
     * Constructor.
     */
    __construct(channel?: string, username?: string, useAttachment?: boolean, userIcon?: string, useShortAttachment?: boolean, includeContextAndExtra?: false, excludeFields?: string[], formatter?: FormatterInterface): void;
    constructor(channel?: string, username?: string, useAttachment?: boolean, userIcon?: string, useShortAttachment?: boolean, includeContextAndExtra?: false, excludeFields?: string[], formatter?: FormatterInterface);

    getSlackData(record: LogRecord): any;

    /**
     * Gets a Slack message attachment color for the given log level.
     */
    getAttachmentColor(level: number): string;

    /**
     * Generates attachment field.
     */
    private _generateAttachmentField(title: string, value: any): Record<string, any>;

    /**
     * Generates a collection of attachment fields from array
     */
    private _generateAttachmentFields(data: Record<string, any>): Record<string, any>[];

    /**
     * Filters the record.
     */
    private _doExcludeFields(record: Record<string, any>, fields?: string[]): void;
}
}
