/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
class EventSubscriberInterface {
    /**
     * Returns an array of event names this subscriber wants to listen to.
     * The array keys are event names and the value can be:
     *
     *  * The method name to call (priority defaults to 0)
     *  * An array composed of the method name to call and the priority
     *  * An array of arrays composed of the method names to call and respective
     *    priorities, or 0 if unset
     *
     * For instance:
     *
     *  * {'eventName': 'methodName'}
     *  * {'eventName': ['methodName', priority]}
     *  * {'eventName': [['methodName1', priority] ['methodName2']]}
     *  * {EventClass: 'methodName'}
     *  * {EventClass: ['methodName', priority]}
     *  * {EventClass: [['methodName1', priority] ['methodName2']]}
     *
     * @returns {Jymfony.Contracts.EventDispatcher.EventSubscriptions} The events name to listen to
     */
    static getSubscribedEvents() { }
}

export default getInterface(EventSubscriberInterface);
