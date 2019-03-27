declare namespace Jymfony.Component.Config {
    export class ConfigCache extends ResourceCheckerConfigCache {
        /**
         * Constructor. Creates a ConfigCache class.
         */
        // @ts-ignore
        __construct(file: string, debug: boolean): void;
        constructor(file: string, debug: boolean);

        /**
         * @inheritdoc
         */
        isFresh(): boolean;
    }
}
