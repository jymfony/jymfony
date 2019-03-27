declare namespace Jymfony.Contracts.EventDispatcher {
    export type EventSubscriptions = Record<string, string|[string, number]|[string, number][]>;

    export class EventSubscriberInterface implements MixinInterface {
        public static readonly definition: Newable<EventSubscriberInterface>;

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
         *
         * @returns {Object} The events name to listen to
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
