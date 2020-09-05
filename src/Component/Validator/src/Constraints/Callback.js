const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Callback extends Constraint {
    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.callback = undefined;
        if ((isArray(options) && isCallableArray(options)) ||
            (isObjectLiteral(options) && undefined === options.callback && undefined === options.groups && undefined === options.payload)) {
            options = { callback: options };
        }

        return super.__construct(options);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'callback';
    }

    /**
     * @inheritdoc
     */
    get targets() {
        return [ __self.CLASS_CONSTRAINT, __self.PROPERTY_CONSTRAINT ];
    }
}
