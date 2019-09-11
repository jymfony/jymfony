const UnsupportedOperationException = Jymfony.Component.Filesystem.Exception.UnsupportedOperationException;
const StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;
const File = Jymfony.Component.Filesystem.File;

/* eslint no-unused-vars: "off" */

/**
 * Abstract stream wrapper implementation.
 * All the methods will throw an UnsupportedOperationException.
 *
 * @abstract
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
export default class AbstractStreamWrapper extends implementationOf(StreamWrapperInterface) {
    /**
     * @inheritdoc
     */
    async readdir(path) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'readdir operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async mkdir(path, mode = 0o777, recursive = false) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'mkdir operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async rmdir(path, recursive = false) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'rmdir operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async rename(fromPath, toPath) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'rename operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async streamOpen(path, mode) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'open operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async streamClose(resource) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'close operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    createReadableStream(resource) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'Cannot create readable stream from %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    createWritableStream(resource) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'Cannot create writable stream from %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async streamRead(resource, count, position = 0, whence = File.SEEK_CUR) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'read operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async streamWrite(resource, buffer, position = 0, whence = File.SEEK_CUR) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'write operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async streamTruncate(resource, length = 0) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'truncate operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async metadata(path, option, value) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'change metadata is not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async stat(path, options) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'stat operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async unlink(path) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'unlink operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async symlink(origin, target) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'symlink operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async readlink(path) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'readlink operation not supported by %s protocol',
            this.protocol
        ));
    }

    /**
     * @inheritdoc
     */
    async realpath(path) {
        throw new UnsupportedOperationException(__jymfony.sprintf(
            'realpath operation not supported by %s protocol',
            this.protocol
        ));
    }
}
