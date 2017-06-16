/**
 * rhusb-rest.js
 *
 * Azure IoT Edge module that reads
 * RH-USB sensor via local REST interface.
 *
 **/

'use strict';

var http = require('http');

module.exports = {

  broker: null,
  configuration: null,
  timedInverval: null,

  /* create() */

  create: function(broker, configuration) {
    console.log("rhusb-rest.create");
    this.broker = broker;
    this.configuration = configuration;
    return true;
  },

  /* start() */

  start: function() {
    console.log("rhusb-rest.start");
    // Periodically query the RH-USB local sensor
    // interface, filter the received data, and
    // publish data to the local broker
    this.timedInteval = setInterval(() => {
      //console.log("Reading sensor");
      var body = "";
      var req = http.request({
        hostname: this.configuration.hostname,
        port: this.configuration.port,
        path: this.configuration.path,
        method: "GET"
      }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          // End of response. Examine what was read,
          // if valid, filter the data and pass on
          // to broker.
          if (body.length > 0) {
            try {
              var data = JSON.parse(body);
              data.source = 'rhusb';
              console.log("rhusb-rest query sensor: " +  JSON.stringify(data));
              this.broker.publish({
                properties: {
                  source: "rhusb"
                },
                content: new Uint8Array(Buffer.from(JSON.stringify(data), 'utf8'))
              });
            } catch (e) {
              console.log("rhusb-rest query sensor: invalid sensor data format, ignoring");
            }
          } else {
            console.log("rhusb-rest query sensor: empty response from sensor, ignoring");
          }
        });
      });
      req.on('error', (e) => {
        console.log("rhusb-rest query sensor: error reading sensor");
        // If error reading the sensor,
        // don't pass anything on to broker
      });
      req.end();
    }, 2000);  // setIterval
  },

  /* receive() */

  receive: function(message) {
    console.log("rhusb-rest.receive");
  },

  /* destroy() */

  destroy: function() {
    clearInterval(this.timedInterval);
    console.log("rhusb-rest.destroy");
  }

};
