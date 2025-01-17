const Constraint = Jymfony.Component.Validator.Annotation.Constraint;
const Constraints = Jymfony.Component.Validator.Constraints;
const EntityInterfaceA = Jymfony.Component.Validator.Fixtures.EntityInterfaceA;

export default class EntityParent extends implementationOf(EntityInterfaceA) {
    accessor firstName;
    #internal;
    #data = 'Data';
    #child;

    /**
     * @NotNull
     */
    @Constraint(Constraints.NotNull)
    accessor other;

    getData() {
        return 'Data';
    }

    getChild() {
        return this.#child;
    }
}
