const File = Jymfony.Component.Filesystem.File;

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
class StreamWrapperInterface {
    /**
     * Performs readdir operation into the directory specified
     * and returns an array of strings representing the names
     * of the files contained in the directory.
     *
     * @param {string} path
     *
     * @returns {Promise<string[]>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.UnsupportedOperationException}
     */
    async readdir(path) { }

    /**
     * Creates a directory, if supported.
     * If the stream does not support directories, this
     * call should be ignored.
     *
     * @param {string} path
     * @param {int} [mode = 0o777]
     * @param {boolean} [recursive = false]
     *
     * @returns {Promise<void>}
     */
    async mkdir(path, mode = 0o777, recursive = false) { }

    /**
     * Removes (optionally recursively) a directory.
     * If recursive is set to true, all the files and the subdirectories
     * should be deleted before the specified path.
     *
     * @param {string} path
     * @param {boolean} [recursive = false]
     *
     * @returns {Promise<void>}
     */
    async rmdir(path, recursive = false) { }

    /**
     * Renames a file/directory.
     *
     * @param {string} fromPath
     * @param {string} toPath
     *
     * @returns {Promise<string[]>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.UnsupportedOperationException}
     */
    async rename(fromPath, toPath) { }

    /**
     * Opens a stream and returns the opened resource.
     *
     * @param {string} path
     * @param {string} mode
     *
     * @returns {Promise<*>}
     */
    async streamOpen(path, mode) { }

    /**
     * Closes a resource. All the resource locked or allocated
     * by the resource should be released.
     *
     * @param {*} resource
     *
     * @returns {Promise<void>}
     */
    async streamClose(resource) { }

    /**
     * Creates a readable stream from an opened file.
     *
     * @param {*} resource
     *
     * @returns {Stream.Readable}
     */
    createReadableStream(resource) { }

    /**
     * Creates a writable stream from an opened file.
     *
     * @param {*} resource
     *
     * @returns {Stream.Writable}
     */
    createWritableStream(resource) { }

    /**
     * Reads some bytes from the given resource.
     *
     * @param {*} resource
     * @param {int} count
     * @param {int} [position = 0]
     * @param {File.SEEK_CUR|File.SEEK_SET|File.SEEK_END} [whence = File.SEEK_CUR]
     *
     * @returns {Promise<Buffer>}
     */
    async streamRead(resource, count, position = 0, whence = File.SEEK_CUR) { }

    /**
     * Writes some bytes to the given resource and
     * returns the bytes written count.
     *
     * @param {*} resource
     * @param {Buffer} buffer
     * @param {int} [position = 0]
     * @param {File.SEEK_CUR|File.SEEK_SET|File.SEEK_END} [whence = File.SEEK_CUR]
     *
     * @returns {Promise<int>}
     */
    async streamWrite(resource, buffer, position = 0, whence = File.SEEK_CUR) { }

    /**
     * Truncates a stream to a given length.
     *
     * @param {*} resource
     * @param {int} [length = 0]
     *
     * @returns {Promise<void>}
     */
    async streamTruncate(resource, length = 0) { }

    /**
     * Change file metadata.
     *
     * @param {string} path
     * @param {string} option
     * @param {*} value
     *
     * @returns {Promise<void>}
     */
    async metadata(path, option, value) { }

    /**
     * Returns stats informations about the given path.
     *
     * @param {string} path
     * @param {Object} [options = { stat_link: false }]
     *
     * @returns {Promise<fs.Stats|boolean>}
     */
    async stat(path, options = { stat_link: false }) { }

    /**
     * Removes a file
     *
     * @param {string} path
     *
     * @returns {Promise<void>}
     */
    async unlink(path) { }

    /**
     * Creates a symbolic link.
     *
     * @param {string} origin
     * @param {string} target
     *
     * @returns {Promise<string>}
     */
    async symlink(origin, target) { }

    /**
     * Resolves a symbolic link.
     *
     * @param {string} path
     *
     * @returns {Promise<string>}
     */
    async readlink(path) { }

    /**
     * Resolves and canonicalize a path.
     *
     * @param {string} path
     *
     * @returns {Promise<string>}
     */
    async realpath(path) { }

    /**
     * Gets the protocol for the current stream wrapper.
     *
     * @returns {string}
     */
    get protocol() { }
}

/**
 * Retrieve informations about a link. Do not follow the link itself.
 */
StreamWrapperInterface.STREAM_URL_STAT_LINK = 0x1;

StreamWrapperInterface.META_TOUCH = 'touch';
StreamWrapperInterface.META_OWNER_NAME = 'chown_name';
StreamWrapperInterface.META_OWNER = 'chown';
StreamWrapperInterface.META_GROUP_NAME = 'chgrp_name';
StreamWrapperInterface.META_GROUP = 'chgrp';
StreamWrapperInterface.META_ACCESS = 'chmod';

export default getInterface(StreamWrapperInterface);
