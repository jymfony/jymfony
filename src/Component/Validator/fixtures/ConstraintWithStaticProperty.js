const Constraint = Jymfony.Component.Validator.Constraint;

export default class ConstraintWithStaticProperty extends Constraint {
}

Object.defineProperty(ConstraintWithStaticProperty, 'foo', { writable: true, value: undefined });
