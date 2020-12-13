import * as url from 'url';
import { basename } from 'path';

const DateTime = Jymfony.Component.DateTime.DateTime;
const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const StreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapper;

const cwd = () => {
    return 'file://' + process.cwd();
};

/**
 * Represents a file.
 *
 * @memberOf Jymfony.Component.Filesystem
 */
export default class File {
    /**
     * Constructor.
     *
     * @param {string} fileName The file path or the complete url.
     *                          The file does not need to exist or to be readable.
     */
    __construct(fileName) {
        /**
         * @type {Url}
         *
         * @private
         */
        this._url = __self.resolve(fileName);

        /**
         * @type {Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface}
         *
         * @protected
         */
        this._streamWrapper = StreamWrapper.get(this._url.href);
    }

    /**
     * Gets the file access time.
     *
     * @returns {Promise<Jymfony.Contracts.DateTime.DateTimeInterface>}
     */
    async getAtime() {
        return new DateTime((await this._stat()).atime);
    }

    /**
     * Gets the file inode change time.
     *
     * @returns {Promise<Jymfony.Contracts.DateTime.DateTimeInterface>}
     */
    async getCtime() {
        return new DateTime((await this._stat()).ctime);
    }

    /**
     * Gets the file modification time.
     *
     * @returns {Promise<Jymfony.Contracts.DateTime.DateTimeInterface>}
     */
    async getMtime() {
        return new DateTime((await this._stat()).mtime);
    }

    /**
     * Gets the file creation time.
     *
     * @returns {Promise<Jymfony.Contracts.DateTime.DateTimeInterface>}
     */
    async getBirthtime() {
        return new DateTime((await this._stat()).birthtime);
    }

    /**
     * Gets the file name.
     *
     * @returns {string}
     */
    get filename() {
        if (__jymfony.Platform.isWindows() && 'file:' === this._url.protocol) {
            return __jymfony.sprintf(
                '%s//%s:%s',
                this._url.protocol,
                this._url.hostname.toUpperCase(),
                (''+this._url.path).replace(/\//g, '\\')
            );
        }

        return this._url.href;
    }

    /**
     * Gets the path name.
     *
     * @returns {string}
     */
    get path() {
        let u = Object.assign({}, this._url, {
            path: null,
            pathname: __jymfony.rtrim(this._url.pathname, '/').split('/').slice(0, -1).join('/'),
        });

        u = url.parse(url.format(u));

        if (__jymfony.Platform.isWindows() && 'file:' === u.protocol) {
            return __jymfony.sprintf(
                '%s//%s:%s', u.protocol, u.hostname.toUpperCase(), ('' + u.path).replace(/\//g, '\\')
            );
        }

        return u.href;
    }

    /**
     * Gets the base name of the file, without the path.
     *
     * @param {undefined|string} extension
     *
     * @returns {string}
     */
    getBasename(extension = undefined) {
        return basename(this._url.pathname, extension);
    }

    /**
     * Gets the file's permissions.
     *
     * @returns {Promise<int>}
     */
    async getPerms() {
        return (await this._stat()).mode;
    }

    /**
     * Gets the file's realpath.
     *
     * @returns {Promise<string>}
     */
    getRealpath() {
        return this._streamWrapper.realpath(this._url.href);
    }

    /**
     * Gets the file's size.
     *
     * @returns {Promise<int>}
     */
    async getSize() {
        return (await this._stat(false)).size;
    }

    /**
     * Opens the file with the given file mode.
     *
     * @param {string} mode
     *
     * @returns {Promise<Jymfony.Component.Filesystem.OpenFile>}
     */
    openFile(mode = 'r') {
        return new OpenFile(this.filename, mode);
    }

    /**
     * Whether the current file represents a directory.
     *
     * @returns {Promise<boolean>}
     */
    async isDirectory() {
        return (await this._stat()).isDirectory();
    }

    /**
     * Whether the current file is a file.
     *
     * @returns {Promise<boolean>}
     */
    async isFile() {
        return (await this._stat()).isFile();
    }

    /**
     * Whether the current file is a block device.
     *
     * @returns {Promise<boolean>}
     */
    async isBlockDevice () {
        return (await this._stat()).isBlockDevice();
    }

    /**
     * Whether the current file is a character device.
     *
     * @returns {Promise<boolean>}
     */
    async isCharacterDevice() {
        return (await this._stat()).isCharacterDevice();
    }

    /**
     * Whether the current file is a symbolic link.
     *
     * @returns {Promise<boolean>}
     */
    async isSymbolicLink() {
        return (await this._stat()).isSymbolicLink();
    }

    /**
     * Whether the current file is a FIFO.
     *
     * @returns {Promise<boolean>}
     */
    async isFIFO() {
        return (await this._stat()).isFIFO();
    }

    /**
     * Whether the current file is a unix socket file.
     *
     * @returns {Promise<boolean>}
     */
    async isSocket() {
        return (await this._stat()).isSocket();
    }

    /**
     * Unlinks the current file.
     *
     * @returns {Promise<void>}
     */
    async unlink() {
        await this._streamWrapper.unlink(this.filename);
    }

    /**
     * Returns the path to the file as a string.
     *
     * @returns {string}
     */
    toString() {
        return this.filename;
    }

    /**
     * Resolves a file path and returns the correspondent Url object.
     *
     * @param {string} fileName
     *
     * @returns {Url}
     */
    static resolve(fileName) {
        if (__jymfony.Platform.isWindows() && fileName.toString().match(/^[a-z]:/i)) {
            fileName = 'file://' + fileName;
        }

        fileName = url.resolve(__jymfony.rtrim(cwd().replace(/\\/g, '/'), '/') + '/', fileName);

        return url.parse(fileName);
    }

    /**
     * Gets the file stat.
     *
     * @returns {Promise<fs.Stats|boolean>}
     *
     * @private
     */
    _stat(stat_link = true) {
        return this._streamWrapper.stat(this.filename, { stat_link });
    }
}

/**
 * Seek from the beginning of the file.
 */
File.SEEK_SET = 'set';

/**
 * Seek from the current position of the file.
 */
File.SEEK_CUR = 'cur';

/**
 * Seek from the end of the file.
 */
File.SEEK_END = 'end';
