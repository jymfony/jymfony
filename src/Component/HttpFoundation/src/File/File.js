import * as fs from 'fs';
import { basename } from 'path';

const DateTime = Jymfony.Component.DateTime.DateTime;
const FileNotFoundException = Jymfony.Component.HttpFoundation.File.Exception.FileNotFoundException;

/**
 * @memberOf Jymfony.Component.HttpFoundation.File
 */
export default class File {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {boolean} checkPath
     */
    __construct(path, checkPath = true) {
        this._fileName = path;
        this._stat = undefined;

        if (checkPath && ! this.exists()) {
            throw new FileNotFoundException(path);
        }
    }

    /**
     * Gets the file mime type as sent from the client.
     *
     * @returns {Promise<string>}
     */
    async getMimeType() {
        if (ReflectionClass.exists('Jymfony.Component.Mime.MimeTypes')) {
            const mimeTypes = Jymfony.Component.Mime.MimeTypes.instance;
            try {
                return await mimeTypes.guessMimeType(this._fileName);
            } catch (e) {
                // Do nothing
            }
        }

        return 'application/octet-stream';
    }

    /**
     * Gets the filename.
     *
     * @returns {string}
     */
    get fileName() {
        return basename(this._fileName);
    }

    /**
     * Gets the file size in bytes.
     *
     * @returns {int}
     */
    get size() {
        if (undefined === this._stat && ! this.exists()) {
            return false;
        }

        return this._stat.size;
    }

    /**
     * Tells if a file exists.
     *
     * @returns {boolean}
     */
    exists() {
        try {
            this._stat = fs.statSync(this._fileName);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Tells if file is readable
     *
     * @returns {boolean}
     */
    get isReadable() {
        try {
            fs.accessSync(this._fileName, fs.constants.R_OK);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Gets the file content.
     *
     * @returns {Stream.Readable}
     */
    get content() {
        return fs.createReadStream(this._fileName);
    }

    /**
     * Gets the last modification time.
     *
     * @returns {Jymfony.Contracts.DateTime.DateTimeInterface}
     */
    get modificationTime() {
        if (undefined === this._stat && ! this.exists()) {
            throw new FileNotFoundException(this._fileName);
        }

        return new DateTime(this._stat.mtime);
    }
}
