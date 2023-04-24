const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const Constraints = Jymfony.Component.Validator.Constraints;

export default class ChildA {
    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotNull)
    @Constraint(Constraints.NotBlank)
    accessor name;

    @Constraint(Constraints.Valid)
    @Constraint(Constraints.NotNull)
    accessor childB;
}
