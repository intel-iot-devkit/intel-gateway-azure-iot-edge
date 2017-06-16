/**
 * rhusb-sim.js
 *
 * Azure IoT Edge module that simulates
 * RH-USB sensor connected to Intel gateway.
 *
 **/

'use strict';

module.exports = {

  broker: null,
  configuration: null,
  timedInverval: null,

  /* create() */

  create: function(broker, configuration) {
    console.log("rhusb-sim.create");
    this.broker = broker;
    this.configuration = configuration;
    return true;
  },

  /* start() */

  start: function() {
    console.log("rhusb-sim.start");

    this.timedInteval = setInterval(() => {
      console.log("Reading sensor");
      // Generate simulated data
      let data = {
        time: new Date(),
        temp: 72.8,
        humid: 50.4,
        source: "rhusb"
      };
      // Publish data to local broker
      this.broker.publish({
        properties: {
          source: "rhusb-sim"
        },
        content: new Uint8Array(Buffer.from(JSON.stringify(data), 'utf8'))
      });
      }, 2000);
  },

  /* receive() */

  receive: function(message) {
    console.log("rhusb-sim.receive");
  },

  /* destroy() */

  destroy: function() {
    clearInterval(this.timedInterval);
    console.log("rhusb-sim.destroy");
  }

};
