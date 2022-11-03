import { Assertion, util } from 'chai' optional nocompile;

if (!! util) {
    const Argument = Jymfony.Component.Testing.Argument.Argument;
    const BlackHoleMetadataFactory = Jymfony.Component.Validator.Mapping.Factory.BlackHoleMetadataFactory;
    const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
    const ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;
    const ConstraintValidatorFactory = Jymfony.Component.Validator.ConstraintValidatorFactory;
    const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
    const ConstraintViolationList = Jymfony.Component.Validator.ConstraintViolationList;
    const ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
    const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
    const Prophet = Jymfony.Component.Testing.Prophet;
    const RecursiveContextualValidator = Jymfony.Component.Validator.Validator.RecursiveContextualValidator;
    const TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
    const ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;
    const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;

    let cloner = null;
    let dumper = null;

    const getDump = data => {
        if (null === cloner) {
            cloner = new VarCloner();
            cloner.maxItems = -1;
        }

        if (null === dumper) {
            dumper = new CliDumper();
            dumper.colors = false;
        }

        return __jymfony.trim(dumper.dump(cloner.cloneVar(data), true));
    };

    const prepareViolation = ({ message, parameters, root, propertyPath = '', invalidValue, plural = null, code = null, constraint = null, cause = null }) => {
        return new ConstraintViolation(message, message, parameters, root, propertyPath, invalidValue, plural, code, constraint, cause);
    };

    util.addChainableMethod(Assertion.prototype, 'validated', null, function () {
        util.flag(this, '__jymfony.validated', true);
    });

    util.addChainableMethod(Assertion.prototype, 'by', function (val, options = {}) {
        if (! util.flag(this, '__jymfony.validated')) {
            throw new Error('by should be used in combination with "validated" keyword');
        }

        let validator = val;
        if (isFunction(val)) {
            validator = new val();
        } else if (isString(val)) {
            validator = new ReflectionClass(val).newInstance();
        }

        util.flag(this, '__jymfony.validated', false);
        util.flag(this, '__jymfony.validator', validator);
        util.flag(this, '__jymfony.validator_options', options);

        return this;
    });

    util.addChainableMethod(Assertion.prototype, 'constraint', function (val) {
        util.flag(this, '__jymfony.validator_constraint', isFunction(val) ? new val() : val);

        return this;
    });

    const violationsAssertions = async function (val = new ConstraintViolationList(), obj = util.flag(this, 'object')) {
        if (val instanceof ConstraintViolationListInterface) {
            val = [ ...val ];
        }

        if (! isArray(val)) {
            val = [ val ];
        }

        const {
            metadata,
            object,
            propertyPath,
            rootObject,
        } = util.flag(this, '__jymfony.validator_options') || {};
        const prophet = new Prophet();

        const validatorProphet = prophet.prophesize(ValidatorInterface);
        const translator = prophet.prophesize(TranslatorInterface);
        translator.trans(Argument.cetera()).will(v0 => v0);

        const context = new ExecutionContext(validatorProphet.reveal(), rootObject || obj, translator.reveal());
        const contextualValidator = new RecursiveContextualValidator(context, new BlackHoleMetadataFactory(), new ConstraintValidatorFactory());
        validatorProphet.inContext(context).willReturn(contextualValidator);
        validatorProphet.locale().willReturn('en-US');
        validatorProphet.validate(Argument.any(), Argument.any(), Argument.cetera())
            .will(async (value, constraints, groups) => {
                const newContext = new ExecutionContext(validatorProphet.reveal(), isObject(value) ? value : undefined, translator.reveal());
                const newContextualValidator = new RecursiveContextualValidator(newContext, new BlackHoleMetadataFactory(), new ConstraintValidatorFactory());
                await newContextualValidator.validate(value, constraints, groups);

                return newContext.violations;
            });

        if (!! object) {
            context.setNode(obj, object, metadata || new ClassMetadata(new ReflectionClass(object)), propertyPath || '');
        }

        /**
         * @type {Jymfony.Component.Validator.ConstraintValidatorInterface}
         */
        const validator = util.flag(this, '__jymfony.validator');
        validator.initialize(context);
        await validator.validate(obj, util.flag(this, '__jymfony.validator_constraint'));

        if (util.flag(this, '__jymfony.no')) {
            this.assert(
                0 === context.violations.length,
                'expected #{this} to raise no violations',
                'expected #{this} to raise some violations',
                getDump(val),
                getDump(context.violations),
                true
            );

            return;
        }

        this.assert(
            val.length === context.violations.length,
            'expected #{this} to raise #{exp} violations. #{act} received.',
            'expected #{this} not to raise violations. #{act} received.',
            val.length,
            context.violations.length,
            true
        );

        let index = 0;
        for (const violation of context.violations) {
            const expectation = prepareViolation({ root: obj, ...val[index] });
            this.assert(
                getDump(violation) === getDump(expectation),
                'expected #{this} to raise violation #{exp}',
                'expected #{this} not to raise violation #{exp}',
                getDump(expectation),
                getDump(violation),
                true
            );

            ++index;
        }
    };

    util.addChainableMethod(Assertion.prototype, 'raise', violationsAssertions);
    util.addChainableMethod(Assertion.prototype, 'violations', violationsAssertions);

    util.addChainableMethod(Assertion.prototype, 'no', null, function () {
        util.flag(this, '__jymfony.no', true);
    });

    util.overwriteMethod(Assertion.prototype, 'throw', function (_super) {
        return function (...args) {
            if (! util.flag(this, '__jymfony.validator')) {
                return _super.apply(this, args);
            }

            return (async () => {
                const obj = util.flag(this, 'object');
                let e;
                try {
                    await violationsAssertions.call(this, [], obj);
                } catch (ex) {
                    e = ex;
                }

                util.flag(this, 'object', () => {
                    if (undefined !== e) {
                        throw e;
                    }
                });

                return _super.apply(this, args);
            })();
        };
    });
}
