const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const FooBarBaz = Jymfony.Component.Validator.Fixtures.Valid.FooBarBaz;

export default class FooBar {
    @Constraint(Valid, { groups: [ 'nested' ]})
    accessor fooBarBaz;

    __construct() {
        this.fooBarBaz = new FooBarBaz();
    }
}
