import { extensions, mimeTypes } from './mime_types_map';

const FileBinaryMimeTypeGuesser = Jymfony.Component.Mime.FileBinaryMimeTypeGuesser;
const MimeTypesInterface = Jymfony.Component.Mime.MimeTypesInterface;

/**
 * @type {Jymfony.Component.Mime.MimeTypes}
 */
let _instance = undefined;

/**
 * @memberOf Jymfony.Component.Mime
 */
export default class MimeTypes extends implementationOf(MimeTypesInterface) {
    __construct() {
        /**
         * @type {Jymfony.Component.Mime.MimeTypeGuesserInterface[]}
         *
         * @private
         */
        this._guessers = [];

        this.registerGuesser(new FileBinaryMimeTypeGuesser());
    }

    /**
     * Registers a MIME type guesser.
     *
     * The last registered guesser has precedence over the other ones.
     *
     * @param {Jymfony.Component.Mime.MimeTypeGuesserInterface} guesser
     */
    registerGuesser(guesser) {
        this._guessers.push(guesser);
    }

    /**
     * @inheritdoc
     */
    isGuesserSupported() {
        for (const guesser of this._guessers) {
            if (guesser.isGuesserSupported()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Guesses the MIME type of the file with the given path.
     *
     * @param {string} path The path to the file
     *
     * @returns {Promise<string|null>} The MIME type or null, if none could be guessed
     *
     * @throws {LogicException}           If the guesser is not supported
     * @throws {InvalidArgumentException} If the file does not exist or is not readable
     */
    async guessMimeType(path) {
        for (const guesser of this._guessers) {
            if (! guesser.isGuesserSupported()) {
                continue;
            }

            const mimeType = await guesser.guessMimeType(path);
            if (!! mimeType) {
                return mimeType;
            }
        }

        if (! this.isGuesserSupported()) {
            throw new LogicException('Unable to guess the MIME type as no guessers are available.');
        }

        return null;
    }

    /**
     * Gets the default mime types instance.
     *
     * @returns {Jymfony.Component.Mime.MimeTypes}
     */
    static get instance() {
        if (! _instance) {
            _instance = new __self();
        }

        return _instance;
    }

    /**
     * Sets the default mime types instance.
     *
     * @param {Jymfony.Component.Mime.MimeTypes} mimeTypes
     */
    static set instance(mimeTypes) {
        _instance = mimeTypes;
    }

    /**
     * Gets the extensions for the given MIME type.
     *
     * @param {string} mimeType
     *
     * @returns {string[]} an array of extensions (first one is the preferred one)
     */
    getExtensions(mimeType) {
        return mimeTypes[mimeType] || [];
    }

    /**
     * Gets the MIME types for the given extension.
     *
     * @param {string} ext
     *
     * @returns {string[]} an array of MIME types (first one is the preferred one)
     */
    getMimeTypes(ext) {
        return extensions[ext] || [];
    };
}
