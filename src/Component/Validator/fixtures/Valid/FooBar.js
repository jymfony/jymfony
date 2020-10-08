import { @Constraint } from '@jymfony/decorators';

const Valid = Jymfony.Component.Validator.Constraints.Valid;
const FooBarBaz = Jymfony.Component.Validator.Fixtures.Valid.FooBarBaz;

export default class FooBar {
    @Constraint(Valid, { groups: [ 'nested' ]})
    fooBarBaz;

    __construct() {
        this.fooBarBaz = new FooBarBaz();
    }
}
