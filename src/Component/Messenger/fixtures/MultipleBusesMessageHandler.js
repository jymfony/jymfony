const MultipleBusesMessage = Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class MultipleBusesMessageHandler {
    __invoke(@Type(MultipleBusesMessage) message) {
    }
}
