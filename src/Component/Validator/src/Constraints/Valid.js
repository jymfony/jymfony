const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Valid extends Constraint {
    traverse = true;

    set groups(groups) {
        super.groups = groups;
    }

    get groups() {
        return null;
    }

    addImplicitGroupName(group) {
        if (null !== this._groups) {
            super.addImplicitGroupName(group);
        }
    }
}
