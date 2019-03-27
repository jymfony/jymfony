declare namespace Jymfony.Component.Mime {
    /**
     * Guesses the MIME type with the binary "file" (available on *nix)
     */
    export class FileBinaryMimeTypeGuesser extends implementationOf(MimeTypeGuesserInterface) {
        private _cmd: string;

        /**
         * Constructor.
         */
        __construct(cmd?: string): void;
        constructor(cmd?: string);

        /**
         * @inheritdoc
         */
        isGuesserSupported(): boolean;

        /**
         * @inheritdoc
         */
        guessMimeType(path: string): Promise<string | null>;
    }
}
