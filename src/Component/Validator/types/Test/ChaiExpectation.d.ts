/// <reference types="chai" />

interface ValidatorOptions {
    metadata?: Jymfony.Contracts.Metadata.MetadataInterface,
    object?: object,
    propertyPath?: null | string,
    rootObject?: object,
}

interface ViolationPrototype {
    root?: any;
    plural?: null | number;
    cause?: null | any;
    message?: string;
    code?: string;
    parameters?: Record<string, any>;
    constraint?: Jymfony.Component.Validator.Constraint;
    invalidValue?: any;
    propertyPath?: string;
}

declare namespace Chai {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;

    interface RaiseCall extends Assertion {
        (violations?: ViolationPrototype[] | ConstraintViolationListInterface): Assertion;
    }

    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        validated: Assertion;
        by<T extends AnyConstructorRaw<ConstraintValidator>>(validator: T, options?: ValidatorOptions): Assertion;
        by(validator: ConstraintValidator, options?: ValidatorOptions): Assertion;
        constraint<T extends AnyConstructorRaw<ConstraintValidator>>(constraint: T): Assertion;
        constraint(constraint: Constraint): Assertion;
        no: Assertion;
        raise: RaiseCall;
        violations: RaiseCall;
    }

    interface Assert {
        validated: Assertion;
        by<T extends AnyConstructorRaw<ConstraintValidator>>(validator: T, options?: ValidatorOptions): Assertion;
        by(validator: ConstraintValidator, options?: ValidatorOptions): Assertion;
        constraint<T extends AnyConstructorRaw<ConstraintValidator>>(constraint: T): Assertion;
        constraint(constraint: Constraint): Assertion;
        no: Assertion;
        raise: RaiseCall;
        violations: RaiseCall;
    }
}
