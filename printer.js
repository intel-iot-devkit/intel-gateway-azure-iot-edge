/**
 * printer.js
 *
 * Azure IoT Edge module that prints 
 * data to the console.
 *
 **/

'use strict';

module.exports = {

  broker: null,
  configuration: null,

  /* create() */

  create: function(broker, configuration) {
    console.log("printer.create");
    this.broker = broker;
    this.configuration = configuration;
    return true;
  },

  /* start() */

  start: function() {
    console.log("printer.start");
  },

  /* receive() */

  receive: function(message) {
    // Print data to the console
    let data = Buffer.from(message.content).toString('utf8');
    console.log(this.configuration.prepend + data);
  },

  /* destroy() */

  destroy: function() {
    console.log("printer.destroy");
  }

};
