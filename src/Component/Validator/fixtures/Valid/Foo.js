const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const Valid = Jymfony.Component.Validator.Constraints.Valid;
const FooBar = Jymfony.Component.Validator.Fixtures.Valid.FooBar;

export default class Foo {
    @Constraint(Valid, { groups: [ 'nested' ]})
    accessor fooBar;

    __construct() {
        this.fooBar = new FooBar();
    }
}
