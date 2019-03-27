declare namespace Jymfony.Component.Mime {
    /**
     * Guesses the MIME type of a file.
     */
    export class MimeTypeGuesserInterface implements MixinInterface {
        public static readonly definition: Newable<MimeTypeGuesserInterface>;

        /**
         * Returns true if this guesser is supported.
         */
        isGuesserSupported(): boolean;

        /**
         * Guesses the MIME type of the file with the given path.
         *
         * @param path The path to the file
         *
         * @returns The MIME type or null, if none could be guessed
         *
         * @throws {LogicException}           If the guesser is not supported
         * @throws {InvalidArgumentException} If the file does not exist or is not readable
         */
        guessMimeType(path: string): Promise<string | null>;
    }
}
