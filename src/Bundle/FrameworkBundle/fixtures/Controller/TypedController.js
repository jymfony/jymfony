import { @Route, @Type } from '@jymfony/decorators';

const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;
const Request = Jymfony.Component.HttpFoundation.Request;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;

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
