import { accessSync, constants as fsConstants, statSync } from 'fs';

const AbstractLoader = Jymfony.Component.Validator.Mapping.Loader.AbstractLoader;
const MappingException = Jymfony.Component.Validator.Exception.MappingException;

/**
 * Base loader for loading validation metadata from a file.
 *
 * @abstract
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class FileLoader extends AbstractLoader {
    /**
     * @type {string}
     *
     * @protected
     */
    _file;

    /**
     * Creates a new loader.
     *
     * @param {string} file The mapping file to load
     *
     * @throws {Jymfony.Component.Validator.Exception.MappingException} If the file does not exist or is not readable
     */
    __construct(file) {
        super.__construct();

        let stat;
        try {
            stat = statSync(file);
        } catch (e) {
            throw new MappingException(__jymfony.sprintf('The mapping file "%s" is not a local file.', file), null, e);
        }

        if (! stat.isFile()) {
            throw new MappingException(__jymfony.sprintf('The mapping file "%s" does not exist.', file));
        }

        try {
            accessSync(file, fsConstants.R_OK);
        } catch (e) {
            throw new MappingException(__jymfony.sprintf('The mapping file "%s" is not readable.', file), null, e);
        }

        this._file = file;
    }
}
