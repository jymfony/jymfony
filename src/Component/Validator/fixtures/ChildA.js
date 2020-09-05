import { @Constraint } from '@jymfony/decorators';

const Constraints = Jymfony.Component.Validator.Constraints;

export default class ChildA {
    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotNull)
    @Constraint(Constraints.NotBlank)
    name;

    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotNull)
    childB;
}
