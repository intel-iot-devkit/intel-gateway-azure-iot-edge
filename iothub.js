/**
 * iothub.js
 *
 * Azure IoT Edge module that sends
 * data to Azure IoT Hub.
 *
 **/

'use strict';

var Protocol = require('azure-iot-device-amqp').AmqpWs;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

module.exports = {

  broker: null,
  configuration: null,
  client: null,
  connected: false,

  /* create() */

  create: function(broker, configuration) {
    console.log("iothub.create");
    this.broker = broker;
    this.configuration = configuration;
    let result = true;

    try {
      this.client = Client.fromConnectionString(this.configuration.connection_string, Protocol);
    } catch (err) {
      console.log("iothub.create: ERROR: Cannot initialize Azure IoT Hub client: ", err);
      result = false;
    }

    return result;
  },

  /* start() */

  start: function() {
    console.log("iothub.start");
    if (this.client) {
      this.client.open(this.connectCallback.bind(this));
    } else {
      console.log("iothub.start: ERROR: Azure IoT Hub client is not ready for use");
    }
  },

  /* receive() */

  receive: function(message) {
    let data = Buffer.from(message.content).toString('utf8');
    console.log("iothub.receive: " + data);
    if (this.client && this.connected) {
      var msg = new Message(data);
      this.client.sendEvent(msg, function(err) {
        if (err) {
          console.log("iothub.receive: ERROR: sendEvent() failed: " + err.toString());
        } else {
          console.log("iothub.receive: Message sent to Azure IoT Hub");
        }
      });
    } else {
      console.log("iothub.receive: ERROR: Azure IoT Hub client is not ready for use");
    }
  },

  /* destroy() */

  destroy: function() {
    console.log("iothub.destroy");
    if (this.client && this.connected) {
      this.client.close(function(err) {
        if (err) {
          console.log("iothub.destroy: ERROR while disconnecting: " + err.toString());
        } else {
          console.log("iothub.destroy: Disconnected from Azure IoT Hub");
        }
      });
    }
  },

  connectCallback: function(err) {
    if (err) {
      console.log("iothub.connect: ERROR: Could not connect to Azure IoT Hub: " + err.message);
    } else {
      console.log("iothub.connect: Connected to Azure IoT Hub");
      this.connected = true;
    }
  }

};
