import { server } from "./app.js";
import {router} from "../routes/path.routes.js"
import * as Sentry from "@sentry/node"


Sentry.init({
  dsn: "https://3bafbe230776d91f7f506aeda5a881ce@o4507149535936512.ingest.us.sentry.io/4507149776453632",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ server }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
server.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
server.use(Sentry.Handlers.tracingHandler());

// All your controllers should live here
server.use("/" , router)

// The error handler must be registered before any other error middleware and after all controllers
server.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
server.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });

server.listen(8000 , (...things) => {
    console.log(things)
})