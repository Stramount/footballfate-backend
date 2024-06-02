import { app , sentry , express_ } from "./app.js";
import {APIrouter} from "../routes/path.routes.js"
import cookieParse from 'cookie-parser'
import dotenv from 'dotenv'
import cors from "cors"

dotenv.config()


sentry.init({
  dsn: "https://3bafbe230776d91f7f506aeda5a881ce@o4507149535936512.ingest.us.sentry.io/4507149776453632",
  integrations: [
    // enable HTTP calls tracing
    new sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
app.use(sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(sentry.Handlers.tracingHandler());

console.log("sentry activo")
console.log(process.env.SECRET_TOKEN)

// All your controllers should live here
let corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 200,
  "credentials": true
}

app.use(cors(corsOptions))
app.use(cookieParse())
app.use(express_.json())
app.use("/api" , APIrouter)

// The error handler must be registered before any other error middleware and after all controllers
app.use(sentry.Handlers.errorHandler());


// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

let port = process.env.PORT || 3000

app.listen(port , (...things) => {
    console.log(things)
})
