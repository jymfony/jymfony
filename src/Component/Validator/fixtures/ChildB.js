const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const Constraints = Jymfony.Component.Validator.Constraints;

export default class ChildB {
    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotBlank)
    accessor name;

    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotBlank)
    accessor childA;
}
