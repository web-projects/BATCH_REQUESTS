import express from 'express';
import timeout from 'connect-timeout';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import http from 'http';
import Grip from './grip';
import * as logger from './logger';
import statApiRouter from './routes/statApiRouter';

const appInsights = require('applicationinsights');
const createError = require('http-errors');

logger.log2('Initializing dotenv config');
dotenv.config();

logger.log2('Initiailizing express framework');
const app = express();

//
// Adjust the timeout value for express and also ensure that it is
// the last middleware on the stack. Failure to do so will cause
// the request flow to stop processing.
// ------------------------------------------------------------------
app.use(timeout(120000));

logger.log2('Initializing JSON for Express');
app.use(express.json());

logger.log2('Express is now configured to parse URL encoded data via querystring lib');
app.use(express.urlencoded({ extended: false }));

logger.log2('Initializing cookie-parser middleware');
app.use(cookieParser());

logger.log2('Making public folder accessible');
app.use(express.static(path.join(__dirname, 'public')));

//
// Additional routers should all be defined here.
// ------------------------------------------------------------------
app.use('/api/stats', statApiRouter);

const grip = new Grip();

//
// Handle rendering of pages by GRIP
// ------------------------------------------------------------------
const renderPage = ((req, res, dataObject) => {
    const renderedHtml = grip.render(dataObject);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write(renderedHtml);
    res.end();
});

//
// Top Level Page Endpoints.
// ------------------------------------------------------------------
app.get('/',
  (req, res) => {
    renderPage(req, res, grip.getHomepageInfo());
  });

//
// Catch 404 and forward to error handler.
// ------------------------------------------------------------------
app.use((req, res, next) => {
  next(createError(404));
});

//
// Catch the timedout event from express and do no further processing.
// ------------------------------------------------------------------
app.use((req, res, next) => {
  if (!req.timedout) {
      next();
  }
});

let server = null;

function runApp() {
  const host = server.address().address;
  const { port } = server.address();

  let absoluteHost = host;
  if (host === '::') {
      absoluteHost = 'localhost';
  }

  // Application Insights SDK connection string gets added automatically
  // within the Azure environment and that's the only time we should run
  // the SDK.
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      logger.log2('Adding application insights connection string "%s" and starting SDK', process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
      // appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
          // Track context across asynchronous callbacks in NodeJS.
      //    .setAutoDependencyCorrelation(true)
          // Allow data to be sent to the live metrics service.
      //    .setSendLiveMetrics(true)
          // Allow calls to be displayed for console.log and also winston and bunyan.
      //    .setAutoCollectConsole(true, true)
      //    .start();
  } else {
      logger.log2('Application Insights SDK not started since we are running locally.');
  }

  logger.log2('Currently running in NODE_ENV "%s"', process.env.NODE_ENV);
  logger.log2('Server listening at %s', `${absoluteHost}:${port}`);
}

function normalizePort(val) {
  const port = parseInt(val, 10);

  // Is it named pipes that Azure wants?
  if (isNaN(port)) {
      return val;
  }

  if (port >= 0) {
      return port;
  }

  return false;
}

function onError(error) {
  logger.log2_e('An error occurred during startup.');
  if (error.syscall !== 'listen') {
    throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.log2('Final resolution binding is %s', bind);
}

//
// Launch the main server on the port specified by environment
// variable or on the default port of 9001.
// ------------------------------------------------------------------
grip.executeSetup().then(() => {
  logger.log2('GRIP setup is complete.');

  if (process.env.NODE_ENV === 'development') {
      logger.log2('Currently running in development mode and setting up a HTTPS listener.');
      const options = {
          key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
          cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem')),
      };
      server = https.createServer(options, app);
  } else {
      logger.log2('Currently running in production mode and setting up a basic HTTP listener.');
      server = http.createServer(app);
  }

  server.listen(normalizePort(process.env.PORT || process.env.LISTENING_PORT), runApp);
  server.on('error', onError);
  server.on('listening', onListening);
}).catch((err) => {
  logger.log2_e('Unable to start IPA5 Dashboards Server');
  logger.log2_e(err);

  process.exit(-1);
});

global.grip = grip;

module.exports = app;

//
// Wire up the exit handler to the NodeJS process to handle
// CTRL + C and process termination signals accurately to
// close down the server properly.
// ------------------------------------------------------------------
function exitHandler() {
  logger.log2('Closing Server socket connections.');
  server.close(() => {
      logger.log2('Closed out remaining connections.');
      process.exit();
  });
}

process.on('SIGTERM', exitHandler.bind(null));
process.on('SIGINT', exitHandler.bind(null));
