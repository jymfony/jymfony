import { readFileSync } from 'fs';

const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;

/**
 * @memberOf Jymfony.Component.Metadata.Loader
 */
export default class FileLoader extends implementationOf(LoaderInterface) {
    /**
     * FileLoader constructor.
     *
     * @param {string} filePath
     */
    __construct(filePath) {
        this._filePath = filePath;
    }

    /**
     * @inheritdoc
     */
    loadClassMetadata(classMetadata) {
        const file_content = readFileSync(this._filePath).toString('utf-8');

        return this._loadClassMetadataFromFile(file_content, classMetadata);
    }

    /**
     * Load class metadata from file content.
     *
     * @param {string} file_content
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} classMetadata
     *
     * @returns {boolean}
     *
     * @abstract
     * @protected
     */
    _loadClassMetadataFromFile(file_content, classMetadata) {} // eslint-disable-line no-unused-vars
}
