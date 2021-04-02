module.exports = function (RED) {
    'use strict'

    function Effect(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', (msg) => {
            var payload = msg.payload

            if (typeof payload === 'string') {
                node.status({ text: payload })
                installationObj.setEffect(payload)
                    .catch((err) => node.error(err.message, err))
            } else {
                node.error(`Unknown payload type: ${typeof payload}. ${JSON.stringify(payload)}`)
            }
        })
    }

    RED.nodes.registerType('effect', Effect)
}