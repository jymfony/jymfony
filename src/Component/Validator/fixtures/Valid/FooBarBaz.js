const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;

export default class FooBarBaz {
    @Constraint(NotBlank, { groups: [ 'nested' ] })
    accessor foo;
}
