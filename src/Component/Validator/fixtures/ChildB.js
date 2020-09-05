import { @Constraint } from '@jymfony/decorators';

const Constraints = Jymfony.Component.Validator.Constraints;

export default class ChildB {
    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotBlank)
    name;

    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotBlank)
    childA;
}
