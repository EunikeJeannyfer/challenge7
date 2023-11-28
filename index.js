//HTTP RESPONSE

require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

const path = require('path')
const flash = require('express-flash')
const session = require('express-session')
const routers = require('./router')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')
const passport = require('./utils/passport')
const morgan = require('morgan')

const Sentry = require('@sentry/node')
const { ProfilingIntegration } = require("@sentry/profiling-node")

//untuk handle post req.body (middleware)
app.use(express.json())
app.use(express.urlencoded({ extended:false })) //req.body untuk form dataa

app.use(morgan('combined'))

//saveUnitialized untuk 
//session digunakan untuk fullstack di express js, tp kalau backend pakai token aja 
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.set("view engine", "ejs") //register sbg view engine flash
app.set("views", path.join(__dirname, './app//view'))

app.use(routers)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))

//SENTRY.IO
Sentry.init({
    dsn: 'https://32e175b976c0863b3e8b0b8257aa2a1b@o4506274955788288.ingest.sentry.io/4506274977284096',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});
  
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res) => res.send('Hello World'))

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });

app.listen(port, () => 
    console.log(`Example app listening at http://localhost:${port}`))

module.exports = app