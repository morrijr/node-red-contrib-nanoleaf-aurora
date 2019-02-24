module.exports = function (RED) {
    'use strict'

    function Power(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', (msg) => {
            var payload = msg.payload

            var operation
            if ((typeof payload === 'boolean' && payload === true) ||
                (typeof payload === 'number' && payload === 1) ||
                (typeof payload === 'string' && payload.toLocaleUpperCase() === 'ON')) {
                operation = true
            } else if ((typeof payload === 'boolean' && payload === false) ||
                (typeof payload === 'number' && payload === 0) ||
                (typeof payload === 'string' && payload.toLocaleUpperCase() === 'OFF')) {
                operation = false
            } else {
                node.error(`Unrecognised payload type: ${typeof payload}. ${JSON.stringify(payload)}`)
                return
            }
            installationObj.setState('on', operation).catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('power', Power)
}