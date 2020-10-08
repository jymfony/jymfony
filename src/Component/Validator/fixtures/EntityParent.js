import { @Constraint } from '@jymfony/decorators';

const Constraints = Jymfony.Component.Validator.Constraints;
const EntityInterfaceA = Jymfony.Component.Validator.Fixtures.EntityInterfaceA;

export default class EntityParent extends implementationOf(EntityInterfaceA) {
    firstName;
    #internal;
    #data = 'Data';
    #child;

    /**
     * @NotNull
     */
    @Constraint(Constraints.NotNull)
    other;

    getData() {
        return 'Data';
    }

    getChild() {
        return this.#child;
    }
}
