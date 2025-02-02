import {logFactory} from '../../Core/core.js';
const log = logFactory(logFactory.flags.bus, 'Bus', 'olive');

// const log = console.log.bind(console); //logFactory(true, 'Bus', 'olive');
// log.error = console.warn.bind(console);

export const MessageBus = class {
  constructor(connection) {
    this.connection = connection;
    this.connection.addEventListener('error', e => log.error('worker failed to load'));
  }
  dispose() {
    this.eventListener.removeEventListener('message', this.listener);
  }
  sendVibration(msg) {
    log(`sending:`, msg);
    try {
      this.connection.postMessage(msg);
    } catch(x) {
      log.error(msg);
      log.error(x);
    }
  }
  receiveVibrations(handler) {
    this.listener = async msg => {
      // TODO(sjmiles): prevent re-entry into `handler`
      const data = (msg.type === 'message') ? msg.data : msg;
      log(`receiving:`, data);
      handler?.(data);
    };
    this.connection.addEventListener('message', this.listener);
  }
};