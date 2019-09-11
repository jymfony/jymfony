const PatternInterface = require('./PatternInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ObjectPattern extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.AssignmentProperty[]} properties
     */
    __construct(location, properties) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.AssignmentProperty[]}
         *
         * @private
         */
        this._properties = properties;
    }

    /**
     * @inheritdoc
     */
    get names() {
        const names = [];
        for (const property of this._properties) {
            const key = property.key;
            const value = property.value;
            if (null === value) {
                if (key instanceof PatternInterface) {
                    names.push(...key.names);
                }
            } else if (value instanceof PatternInterface) {
                names.push(...value.names);
            }
        }

        return names;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('{ ');

        for (const i in this._properties) {
            const property = this._properties[i];
            compiler.compileNode(property);

            if (i != this._properties.length - 1) {
                compiler._emit(', ');
            }
        }

        compiler._emit(' }');
    }
}

module.exports = ObjectPattern;
