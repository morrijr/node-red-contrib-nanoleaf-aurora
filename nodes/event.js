const EventSource = require('../lib/eventsource.js');
module.exports = function(RED) {
  'use strict';

  // const Ping = require('ping-url');
  var ping = require('ping');
  const EventSource = require('../lib/eventsource.js');

  function Event(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var installationObj = RED.nodes.getNode(config.installation);

    if (installationObj && installationObj.host) {
      node.url = `http://${installationObj.host}:${installationObj.port}${installationObj.base}${installationObj.accessToken}`;
      connect();

      //check connection
      setInterval(function(){
        ping.sys.probe(installationObj.host, function(isAlive){
          if (!isAlive) {
            closeClients();
          }
          connect();
        });
      },10000);
    }

    node.status({fill: 'red', shape: 'ring', text: 'disconnected'});

    function handleEvent(e) {
      if (e.type === 'open') return;
      if (e.type === 'error') return;

      var payload = e.data;
      try {
        payload = JSON.parse(e.data).events[0];
      } catch (e) {
        node.warn(payload);
      }

      let eventType = '';
      if (e.lastEventId == 1) {
        eventType = 'state';
      } else if (e.lastEventId == 2) {
        eventType = 'layout';
      } else if (e.lastEventId == 3) {
        eventType = 'effect';
      } else if (e.lastEventId == 4) {
        eventType = 'touch';
      }

      node.send({
        event: eventType,
        event_id: parseInt(e.lastEventId),
        payload: payload,
        payload_raw: e.data,
      });
    }

    function connect() {
      if (!node.client) {

        if (!node.url) {
          node.status({fill: 'red', shape: 'dot', text: 'no url'});
          return;
        }

        // Start a new stream (i.e. send a new http get)
        node.client = new EventSource(node.url + '/events?id=1,2,3,4');

        node.client.onopen = function() {
          node.status({fill: 'green', shape: 'dot', text: 'connected'});
          node.log('Connected')
        };
        node.client.onerror = function(err) {
          node.log(err);
          node.status({fill: 'red', shape: 'dot', text: `Error: ${err.message}`});
          closeClients();
        };
        node.client.onAnyMessage = function(eventType, event) {
          handleEvent(event);
        };
      }
    }

    node.on('close', function() {
      closeClients();
    });

    function closeClients() {
      node.status({fill: 'red', shape: 'ring', text: 'disconnected'});
      if (node.client) {
        node.client.close();
        node.client = null;
      }
    }


  }

  RED.nodes.registerType('event', Event);
};

