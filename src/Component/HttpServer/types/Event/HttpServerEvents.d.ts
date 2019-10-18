declare namespace Jymfony.Component.HttpServer.Event {
    export class HttpServerEvents {
        public static readonly REQUEST = 'http.request';
        public static readonly EXCEPTION = 'http.exception';
        public static readonly VIEW = 'http.view';
        public static readonly CONTROLLER = 'http.controller';
        public static readonly RESPONSE = 'http.response';
        public static readonly POST_RESPONSE = 'http.post_response';
        public static readonly FINISH_REQUEST = 'http.finish_request';

        public static readonly SERVER_TERMINATE = 'http.server_terminate';
    }
}
