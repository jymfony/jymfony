import { @Constraint } from '@jymfony/decorators';

const Valid = Jymfony.Component.Validator.Constraints.Valid;
const FooBar = Jymfony.Component.Validator.Fixtures.Valid.FooBar;

export default class Foo {
    @Constraint(Valid, { groups: [ 'nested' ]})
    fooBar;

    __construct() {
        this.fooBar = new FooBar();
    }
}
