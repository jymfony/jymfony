import { @Constraint, @GroupSequence } from '@jymfony/decorators';

const ConstraintA = Jymfony.Component.Validator.Fixtures.ConstraintA;
const CallbackClass = Jymfony.Component.Validator.Fixtures.CallbackClass;
const Constraints = Jymfony.Component.Validator.Constraints;
const EntityInterfaceB = Jymfony.Component.Validator.Fixtures.EntityInterfaceB;
const EntityParent = Jymfony.Component.Validator.Fixtures.EntityParent;

@Constraint(ConstraintA)
@Constraint(Constraints.Callback, CallbackClass.callback)
@GroupSequence([ 'Foo', 'Entity' ])
export default class Entity extends mix(EntityParent, EntityInterfaceB) {
    @Constraint(Constraints.NotNull)
    @Constraint(Constraints.Range, { min: 3 })
    @Constraint(Constraints.Choice, { choices: [ 'A', 'B' ], message: 'Must be one of %choices%' })
    @Constraint(Constraints.All, [
        new Constraints.NotNull(),
        new Constraints.Range({ min: 3 }),
    ])
    @Constraint(Constraints.All, { constraints: [
        new Constraints.NotNull(),
        new Constraints.Range({ min: 3 }),
    ] })
    @Constraint(Constraints.Collection, { fields: {
        foo: [ new Constraints.NotNull(), new Constraints.Range({ min: 3 }) ],
        bar: new Constraints.Range({ min: 5 })
    } })
    firstName;

    @Constraint(Constraints.Valid)
    childA;

    @Constraint(Constraints.Valid)
    childB;

    /**
     * @protected
     */
    _lastName;
    reference;
    reference2;

    #internal;
    data = 'Overridden data';
    initialized = false;

    constructor(internal = null) {
        super();
        this.#internal = internal;
    }

    getFirstName() {
        return this.firstName;
    }

    get internal() {
        return this.#internal + ' from getter';
    }

    setLastName(lastName) {
        this._lastName = lastName;
    }

    @Constraint(Constraints.NotNull)
    getLastName() {
        return this._lastName;
    }

    getValid() {
    }

    @Constraint(Constraints.IsTrue)
    isValid() {
        return 'valid';
    }

    @Constraint(Constraints.IsTrue)
    hasPermissions() {
        return 'permissions';
    }

    getData() {
        return 'Overridden data';
    }

    /**
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     */
    @Constraint(Constraints.Callback, { payload: 'foo' })
    validateMe(context) {
    }

    /**
     * @param {Entity} object
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     */
    @Constraint(Constraints.Callback)
    static validateMeStatic(object, context)
    {
    }

    /**
     * @returns {*}
     */
    getChildA() {
        return this.childA;
    }

    /**
     * @param {*} childA
     */
    setChildA(childA) {
        this.childA = childA;
    }

    /**
     * @returns {*}
     */
    getChildB() {
        return this.childB;
    }

    /**
     * @param {*} childB
     */
    setChildB(childB) {
        this.childB = childB;
    }

    getReference() {
        return this.reference;
    }
}
