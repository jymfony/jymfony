const MimeTypeGuesserInterface = Jymfony.Component.Mime.MimeTypeGuesserInterface;

/**
 * @memberOf Jymfony.Component.Mime
 */
class MimeTypesInterface extends MimeTypeGuesserInterface.definition {
    /**
     * Gets the extensions for the given MIME type.
     *
     * @param {string} mimeType
     *
     * @returns {string[]} an array of extensions (first one is the preferred one)
     */
    getExtensions(mimeType) { }

    /**
     * Gets the MIME types for the given extension.
     *
     * @param {string} ext
     *
     * @returns {string[]} an array of MIME types (first one is the preferred one)
     */
    getMimeTypes(ext) { }
}

export default getInterface(MimeTypesInterface);
