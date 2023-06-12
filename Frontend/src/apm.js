import { init as initApm, apm } from '@elastic/apm-rum';

export function initApmAgent() {
  initApm({
    serviceName: 'ArequipetWeb',
    serverUrl: 'http://35.196.30.242:8200/',
    // Additional configuration options can be specified here
  });

  // Register global error handler
  window.addEventListener('error', (event) => {
    apm.captureError(event.error || new Error(event.message));
  });
}