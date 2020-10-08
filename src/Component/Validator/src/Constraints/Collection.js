const Composite = Jymfony.Component.Validator.Constraints.Composite;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Optional = Jymfony.Component.Validator.Constraints.Optional;
const Required = Jymfony.Component.Validator.Constraints.Required;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Collection extends Composite {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.MISSING_FIELD_ERROR: return 'MISSING_FIELD_ERROR';
            case __self.NO_SUCH_FIELD_ERROR: return 'NO_SUCH_FIELD_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.fields = [];
        this.allowExtraFields = false;
        this.allowMissingFields = false;
        this.extraFieldsMessage = 'This field was not expected.';
        this.missingFieldsMessage = 'This field is missing.';

        // No known options set? $options is the fields array
        const opts = [ 'groups', 'fields', 'allowExtraFields', 'allowMissingFields', 'extraFieldsMessage', 'missingFieldsMessage' ];
        if (isObjectLiteral(options) && 0 === Object.keys(options).filter(k => opts.includes(k)).length) {
            options = { fields: options };
        }

        return super.__construct(options);
    }

    /**
     * @inheritdoc
     */
    _initializeNestedConstraints() {
        super._initializeNestedConstraints();

        if (! isObjectLiteral(this.fields)) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The option "fields" is expected to be an hash map in constraint "%s".', ReflectionClass.getClassName(this)));
        }

        for (let [ fieldName, field ] of __jymfony.getEntries(this.fields)) {
            // The YamlFileLoader pass the field Optional
            // And Required constraint as an array with exactly one element
            if (isArray(field) && 1 === field.length) {
                this.fields[fieldName] = field = field[0];
            }

            if (! (field instanceof Optional) && ! (field instanceof Required)) {
                this.fields[fieldName] = new Required(field);
            }
        }
    }

    getRequiredOptions() {
        return [ 'fields' ];
    }

    _getCompositeOption() {
        return 'fields';
    }
}

Object.defineProperties(Collection, {
    MISSING_FIELD_ERROR: { value: '2fa2158c-2a7f-484b-98aa-975522539ff8', writable: false },
    NO_SUCH_FIELD_ERROR: { value: '7703c766-b5d5-4cef-ace7-ae0dd82304e9', writable: false },
});
