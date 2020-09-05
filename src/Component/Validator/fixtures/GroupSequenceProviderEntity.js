import { @GroupSequenceProvider } from '@jymfony/decorators';

const GroupSequenceProviderInterface = Jymfony.Component.Validator.GroupSequenceProviderInterface;

@GroupSequenceProvider()
export default class GroupSequenceProviderEntity extends implementationOf(GroupSequenceProviderInterface) {
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
