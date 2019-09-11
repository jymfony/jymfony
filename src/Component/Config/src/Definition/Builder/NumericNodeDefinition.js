const ScalarNodeDefinition = Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition;
const InvalidDefinitionException = Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException;

/**
 * Abstract class that contains common code of integer and float node definitions.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 *
 * @abstract
 */
export default class NumericNodeDefinition extends ScalarNodeDefinition {
    /**
     * @inheritdoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        /**
         * @type {number|undefined}
         *
         * @protected
         */
        this._min = undefined;

        /**
         * @type {number|undefined}
         *
         * @protected
         */
        this._max = undefined;
    }

    /**
     * Ensures that the value is smaller than the given reference.
     *
     * @param {number} max
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NumericNodeDefinition}
     *
     * @throws {InvalidArgumentException} when the constraint is inconsistent
     */
    max(max) {
        if (undefined !== this._min && this._min > max) {
            throw new InvalidArgumentException(__jymfony.sprintf('You cannot define a max(%s) as you already have a min(%s)', max, this._min));
        }
        this._max = max;

        return this;
    }

    /**
     * Ensures that the value is bigger than the given reference.
     *
     * @param {number} min
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NumericNodeDefinition}
     *
     * @throws {InvalidArgumentException} when the constraint is inconsistent
     */
    min(min) {
        if (undefined !== this._max && this._max < min) {
            throw new InvalidArgumentException(__jymfony.sprintf('You cannot define a min(%s) as you already have a max(%s)', min, this._max));
        }
        this._min = min;

        return this;
    }

    /**
     * @inheritdoc
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
     */
    cannotBeEmpty() {
        throw new InvalidDefinitionException('cannotBeEmpty() is not applicable to BooleanNodeDefinition.');
    }
}
