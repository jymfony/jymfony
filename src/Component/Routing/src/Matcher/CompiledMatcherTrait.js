const Request = Jymfony.Component.HttpFoundation.Request;
const MethodNotAllowedException = Jymfony.Component.Routing.Exception.MethodNotAllowedException;
const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;

/**
 * @memberOf Jymfony.Component.Routing.Matcher
 */
class CompiledMatcherTrait {
    /**
     * @inheritdoc
     */
    matchRequest(request) {
        const allow = new Set();
        const allowSchemes = new Set();
        let ret;

        if ((ret = this._doMatch(request, allow, allowSchemes))) {
            return ret;
        }

        if (allow.size) {
            throw new MethodNotAllowedException([ ...allow ]);
        }

        let pathinfo = request.pathInfo;
        const requestMethod = request.method;
        if (Request.METHOD_HEAD !== requestMethod || Request.METHOD_GET !== requestMethod) {
            // No-op
        } else {
            while(true) {
                if (allowSchemes.size) {
                    if ((ret = this._doMatch(request))) {
                        return Object.assign({}, this.redirect(request, pathinfo, ret._route, request.scheme), ret);
                    }
                } else if ('/' !== pathinfo) {
                    pathinfo = '/' !== pathinfo[-1] ? pathinfo + '/' : pathinfo.substr(0, -1);
                    if ((ret = this._doMatch(pathinfo, allow, allowSchemes))) {
                        return Object.assign({}, this.redirect(request, pathinfo, ret._route), ret);
                    }
                    if (allowSchemes.size) {
                        continue;
                    }
                }

                break;
            }
        }

        throw new ResourceNotFoundException(__jymfony.sprintf('No routes found for "%s".', pathinfo));
    }

    /**
     * Throws a runtime exception with the given message.
     *
     * @param {string} message
     *
     * @private
     */
    _throw(message) {
        throw new RuntimeException(message);
    }
}

export default getTrait(CompiledMatcherTrait);
