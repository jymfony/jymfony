const GroupSequenceProvider = Jymfony.Component.Validator.Annotation.GroupSequenceProvider;
const GroupSequenceProviderInterface = Jymfony.Component.Validator.GroupSequenceProviderInterface;

export default
@GroupSequenceProvider()
class GroupSequenceProviderEntity extends implementationOf(GroupSequenceProviderInterface) {
    firstName;
    lastName;

    _sequence = [];

    __construct(sequence) {
        this._sequence = sequence;
    }

    get groupSequence() {
        return this._sequence;
    }
}
