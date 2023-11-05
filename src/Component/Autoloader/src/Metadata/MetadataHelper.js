class MetadataHelper {
    /**
     * @param {string | symbol} name
     * @param {number} [index]
     * @param {string} kind
     * @param {object} metadata
     * @param {object} [fn]
     */
    static ensureMetadataStorageHasBeenInitialized({ kind, index, name, metadata, function: fn }) {
        if ('class' === kind) {
            return;
        }

        if ('method' === kind) {
            if (metadata[Symbol.for('jymfony.methods.annotations')] === undefined) {
                metadata[Symbol.for('jymfony.methods.annotations')] = Object.create(null);
            }

            if (metadata[Symbol.for('jymfony.methods.annotations')][name] === undefined) {
                metadata[Symbol.for('jymfony.methods.annotations')][name] = Object.create(null);
            }

            if (metadata[Symbol.for('jymfony.methods.annotations')][name][Symbol.for('jymfony.methods.parameters')] === undefined) {
                metadata[Symbol.for('jymfony.methods.annotations')][name][Symbol.for('jymfony.methods.parameters')] = Object.create(null);
            }
        }

        if ('parameter' === kind) {
            this.ensureMetadataStorageHasBeenInitialized({ kind: 'method', name: fn.name, metadata });
            if (metadata[Symbol.for('jymfony.methods.annotations')][fn.name][Symbol.for('jymfony.methods.parameters')][index] === undefined) {
                metadata[Symbol.for('jymfony.methods.annotations')][fn.name][Symbol.for('jymfony.methods.parameters')][index] = Object.create(null);
            }
        } else {
            if (metadata[Symbol.for('jymfony.fields.annotations')] === undefined) {
                metadata[Symbol.for('jymfony.fields.annotations')] = Object.create(null);
            }

            name = 'getter' === kind ? 'get ' + name : ('setter' === kind ? 'set ' + name : name);
            if (metadata[Symbol.for('jymfony.fields.annotations')][name] === undefined) {
                metadata[Symbol.for('jymfony.fields.annotations')][name] = Object.create(null);
            }
        }
    }

    static getMetadataTarget(context) {
        this.ensureMetadataStorageHasBeenInitialized(context);
        const { kind, name, metadata } = context;

        switch (kind) {
            case 'class':
                return metadata;
            case 'method':
                return metadata[Symbol.for('jymfony.methods.annotations')][name];
            case 'parameter':
                return metadata[Symbol.for('jymfony.methods.annotations')][context.function.name][Symbol.for('jymfony.methods.parameters')][context.index];
            case 'getter':
                return metadata[Symbol.for('jymfony.fields.annotations')]['get ' + name];
            case 'setter':
                return metadata[Symbol.for('jymfony.fields.annotations')]['set ' + name];
            case 'field':
            case 'accessor':
                return metadata[Symbol.for('jymfony.fields.annotations')][name];
        }
    }
}

module.exports = MetadataHelper;
