import { @Constraint } from '@jymfony/decorators';

const NotBlank = Jymfony.Component.Validator.Constraints.NotBlank;

export default class FooBarBaz {
    @Constraint(NotBlank, { groups: [ 'nested' ] })
    foo;
}
