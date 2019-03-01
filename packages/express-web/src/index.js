const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const { isFunction: isFn } = require('@base-cms/utils');
const express = require('./express');

const startServer = async ({
  siteDir,
  siteConfig,
  port = 4008,
  routes,
  graphqlUri,
  apolloConfig,
  engineConfig,
  timeout = 1000,
  signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'],
  healthCheckPath = '/_health',
  onSignal,
  onShutdown,
  onStart,
  onHealthCheck,
} = {}) => {
  if (!siteDir) throw new Error('No site directory was provided.');

  const app = express({
    siteDir,
    siteConfig,
    graphqlUri,
    apolloConfig,
    engineConfig,
  });

  // Load website routes.
  if (!isFn(routes)) throw new Error('A routes function is required.');
  routes(app);

  // Await required services here...
  if (isFn(onStart)) await onStart(app);

  const server = http.createServer(app);

  createTerminus(server, {
    timeout,
    signals,
    // Add health checks of services here...
    healthChecks: {
      [healthCheckPath]: async () => {
        if (isFn(onHealthCheck)) return onHealthCheck();
        return { ping: 'pong' };
      },
    },
    onSignal: async () => {
      // Stop required services here...
      if (isFn(onSignal)) await onSignal();
    },
    onShutdown: async () => {
      if (isFn(onShutdown)) await onShutdown();
    },
  });

  return new Promise((res, rej) => {
    server.listen(port, function listen(err) {
      if (err) { rej(err); } else { res(this); }
    });
  });
};

module.exports = {
  startServer,
};