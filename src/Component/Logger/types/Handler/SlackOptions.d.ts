interface SlackOptions {
    channel?: string;
    username?: string;
    useAttachment?: boolean;
    icon?: string;
    shortAttachment?: boolean;
    includeContextAndExtra?: boolean;
    excludeFields?: string[];
    token: string;
}
