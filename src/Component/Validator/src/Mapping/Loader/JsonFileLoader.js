import { readFileSync } from 'fs';
const FileLoader = Jymfony.Component.Validator.Mapping.Loader.FileLoader;

/**
 * Loads validation metadata from a JSON file.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class JsonFileLoader extends FileLoader {
    /**
     * An array of Json class descriptions.
     *
     * @type {null|Object.<string, *>}
     *
     * @protected
     */
    _classes = null;

    /**
     * @inheritdoc
     */
    loadClassMetadata(metadata) {
        if (null === this._classes) {
            this._loadClasses();
        }

        if (undefined !== this._classes[metadata.name]) {
            this._loadClassMetadata(metadata, this._classes[metadata.name]);
        }
    }

    /**
     * Return the names of the classes mapped in this file.
     *
     * @returns {string[]} The classes names
     */
    getMappedClasses() {
        if (null === this._classes) {
            this._loadClasses();
        }

        return Object.keys(this._classes);
    }

    /**
     * Parses a collection of YAML nodes.
     *
     * @param {Object.<string, *>} nodes The YAML nodes
     *
     * @returns {*[]|Object.<string, *>} An array of values or Constraint instances
     *
     * @protected
     */
    _parseNodes(nodes) {
        const nodesIsArray = isArray(nodes);
        const values = {};

        for (let [ name, childNodes ] of __jymfony.getEntries(nodes)) {
            if (isNumeric(name) && (isArray(childNodes) || isObjectLiteral(childNodes)) && 1 === Object.keys(childNodes).length) {
                let options = Object.values(childNodes)[0];

                if (isArray(options) || isObjectLiteral(options)) {
                    options = this._parseNodes(options);
                }

                values[name] = this._newConstraint(Object.keys(childNodes)[0], options);
            } else {
                if (isArray(childNodes) || isObjectLiteral(childNodes)) {
                    childNodes = this._parseNodes(childNodes);
                }

                values[name] = childNodes;
            }
        }

        return nodesIsArray ? Object.values(values) : values;
    }

    /**
     * Loads the class descriptions from the given file.
     *
     * @throws {InvalidArgumentException} If the file could not be loaded or did not contain a YAML
     *
     * @protected
     */
    _parseFile() {
        const fileContent = readFileSync(this._file).toString('utf-8');
        if ('' === fileContent) {
            return {};
        }

        let classes;
        try {
            classes = JSON.parse(fileContent);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not contain valid JSON: ', this._file) + e.message, 0, e);
            }

            throw e;
        }

        // Empty file
        if (null === classes) {
            return {};
        }

        // Not an array
        if (! isObjectLiteral(classes)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" must contain a JSON object.', this._file));
        }

        return classes;
    }

    /**
     * @private
     */
    _loadClasses() {
        this._classes = this._parseFile();
        if (this._classes.namespaces) {
            for (const [ alias, namespace ] of __jymfony.getEntries(this._classes.namespaces)) {
                this._addNamespaceAlias(alias, namespace);
            }

            delete this._classes.namespaces;
        }
    }

    /**
     * @param {Jymfony.Component.Validator.Mapping.ClassMetadata} metadata
     * @param {*} classDescription
     *
     * @private
     */
    _loadClassMetadata(metadata, classDescription) {
        if (undefined !== classDescription.group_sequence_provider) {
            metadata.setGroupSequenceProvider(!! classDescription.group_sequence_provider);
        }

        if (undefined !== classDescription.group_sequence) {
            metadata.setGroupSequence(classDescription.group_sequence);
        }

        if (undefined !== classDescription.constraints &&
            (isArray(classDescription.constraints) || isObjectLiteral(classDescription.constraints))) {
            for (const constraint of Object.values(this._parseNodes(classDescription.constraints))) {
                metadata.addConstraint(constraint);
            }
        }

        if (undefined !== classDescription.fields && isObjectLiteral(classDescription.fields)) {
            for (const [ field, constraints ] of __jymfony.getEntries(classDescription.fields)) {
                if (! constraints) {
                    continue;
                }

                for (const constraint of Object.values(this._parseNodes(constraints))) {
                    metadata.addFieldConstraint(field, constraint);
                }
            }
        }

        if (undefined !== classDescription.properties && isObjectLiteral(classDescription.properties)) {
            for (const [ property, constraints ] of __jymfony.getEntries(classDescription.properties)) {
                if (! constraints) {
                    continue;
                }

                for (const constraint of Object.values(this._parseNodes(constraints))) {
                    metadata.addPropertyGetterConstraint(property, constraint);
                }
            }
        }

        if (undefined !== classDescription.getters && isObjectLiteral(classDescription.getters)) {
            for (const [ getter, constraints ] of __jymfony.getEntries(classDescription.getters)) {
                if (! constraints) {
                    continue;
                }

                for (const constraint of Object.values(this._parseNodes(constraints))) {
                    metadata.addGetterConstraint(getter, constraint);
                }
            }
        }
    }
}
