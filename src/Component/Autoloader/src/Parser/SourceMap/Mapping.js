const collator = new Intl.Collator('en');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.SourceMap
 */
class Mapping {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} generated
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} [original]
     * @param {null|string} [source]
     * @param {null|string} [name]
     */
    constructor(generated, original = null, source = null, name = null) {
        this.generatedLine = generated.line;
        this.generatedColumn = generated.column;
        this.originalLine = null !== original && original.line;
        this.originalColumn = null !== original && original.column;
        this.source = source;
        this.name = name;
    }

    /**
     * Comparator between two mappings with inflated source and name strings where
     * the generated positions are compared.
     *
     * @param {Jymfony.Component.Autoloader.Parser.SourceMap.Mapping} other
     */
    compareByGeneratedPositionsInflated(other) {
        let cmp = this.generatedLine - other.generatedLine;
        if (0 !== cmp) {
            return cmp;
        }

        cmp = this.generatedColumn - other.generatedColumn;
        if (0 !== cmp) {
            return cmp;
        }

        cmp = collator.compare(String(this.source), String(other.source));
        if (0 !== cmp) {
            return cmp;
        }

        cmp = this.originalLine - other.originalLine;
        if (0 !== cmp) {
            return cmp;
        }

        cmp = this.originalColumn - other.originalColumn;
        if (0 !== cmp) {
            return cmp;
        }

        return collator.compare(String(this.name), String(other.name));
    }

    /**
     * Comparator between two mappings with deflated source and name indices where
     * the generated positions are compared.
     */
    static compareByGeneratedPositionsDeflated(this_, other) {
        let cmp = this_.generatedLine - other.generatedLine;
        if (0 !== cmp) {
            return cmp;
        }

        cmp = this_.generatedColumn - other.generatedColumn;
        if (0 !== cmp) {
            return cmp;
        }

        if (undefined === other.originalLine || undefined === other.originalColumn) {
            return cmp;
        }

        cmp = this_.originalLine - other.originalLine;
        if (0 !== cmp) {
            return cmp;
        }

        return this_.originalColumn - other.originalColumn;
    }
}

module.exports = Mapping;
