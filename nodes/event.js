module.exports = function (RED) {
    'use strict'

    const EventSource = require('../lib/eventsource.js')

    function Event(config) {
        RED.nodes.createNode(this, config)
        var node = this
        var installationObj = RED.nodes.getNode(config.installation)

        if (installationObj && installationObj.host) {
            node.url = `http://${installationObj.host}:${installationObj.port}${installationObj.base}${installationObj.accessToken}`
            connect();
        }

        node.status({fill: 'red', shape: 'ring', text: 'disconnected'})


        function handleEvent(e, eventType) {
            if (e.type === 'open')  return

            var payload = e.data;
            try {
                payload = JSON.parse(e.data).events[0]
            } catch (e) {
                node.warn(payload);
            }

            node.send({
                event: eventType,
                payload: payload,
                payload_raw: e.data
            })
        }

        function connect() {
            if (!node.client1) {

                if (!node.url) {
                    node.status({fill: 'red', shape: 'dot', text: 'no url'})
                    return
                }

                // Start a new stream (i.e. send a new http get)
                node.client1 = new EventSource(node.url+'/events?id=1')
                node.client2 = new EventSource(node.url+'/events?id=2')
                node.client3 = new EventSource(node.url+'/events?id=3')
                node.client4 = new EventSource(node.url+'/events?id=4')

                node.client1.onopen = function() {
                    node.status({fill: 'green', shape: 'dot', text: 'connected'})
                }
                node.client1.onerror = function(err) {
                    node.status({fill: 'red', shape: 'dot', text: `Error: ${err.message}`})
                }
            }

            // Handle ALL events.
            node.client1.onAnyMessage = function(eventType, event) {
                handleEvent(event, 'state')
            }
            node.client2.onAnyMessage = function(eventType, event) {
                handleEvent(event, 'layout')
            }
            node.client3.onAnyMessage = function(eventType, event) {
                handleEvent(event, 'effects')
            }
            node.client4.onAnyMessage = function(eventType, event) {
                handleEvent(event, 'touch')
            }
        }

        node.on('close', function() {
            node.status({fill: 'red', shape: 'ring', text: 'disconnected'})

            if (node.client1) {
                node.client1.close()
            }
            if (node.client2) {
                node.client2.close()
            }
            if (node.client3) {
                node.client3.close()
            }
            if (node.client4) {
                node.client4.close()
            }
        })
    }

    RED.nodes.registerType('event', Event)
}

