import { init as initApm, apm } from '@elastic/apm-rum';

export function initApmAgent() {
  initApm({
    serviceName: 'your-service-name',
    serverUrl: 'http://your-apm-server-url',
    // Additional configuration options can be specified here
  });

  // Register global error handler
  window.addEventListener('error', (event) => {
    apm.captureError(event.error || new Error(event.message));
  });
}