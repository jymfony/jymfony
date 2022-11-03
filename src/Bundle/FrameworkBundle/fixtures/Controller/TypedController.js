const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const Request = Jymfony.Component.HttpFoundation.Request;
const Route = Jymfony.Component.Routing.Annotation.Route;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class TypedController extends AbstractController {
    @Route('/first')
    action(@Type(EventDispatcherInterface) eventDispatcher, @Type(Request) request) {
        return this.json([
            ReflectionClass.getClassName(eventDispatcher),
            ReflectionClass.getClassName(request),
        ]);
    }
}
