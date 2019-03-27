declare namespace Jymfony.Component.Mime {
    export class MimeTypes extends implementationOf(MimeTypesInterface) {
        private _guessers: MimeTypeGuesserInterface[];

        __construct(): void;
        constructor();

        /**
         * Registers a MIME type guesser.
         *
         * The last registered guesser has precedence over the other ones.
         */
        registerGuesser(guesser: MimeTypeGuesserInterface): void;

        /**
         * @inheritdoc
         */
        isGuesserSupported(): boolean;

        /**
         * @inheritdoc
         */
        guessMimeType(path: string): Promise<string | null>;

        /**
         * Gets/sets the default mime types instance.
         *
         * @returns {Jymfony.Component.Mime.MimeTypes}
         */
        public static instance: MimeTypes;

        /**
         * @inheritdoc
         */
        getExtensions(mimeType: string): string[];

        /**
         * @inheritdoc
         */
        getMimeTypes(ext: string): string[];
    }
}
