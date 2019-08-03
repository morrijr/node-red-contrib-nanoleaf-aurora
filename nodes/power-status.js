module.exports = function (RED) {
    'use strict'

    function PowerStatus(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        const convertOutput = (info) => {
            switch (config.outputType) {
                case 'Boolean':
                    return info
                case 'Numeric':
                    return info ? 1 : 0
                case 'String':
                default:
                    return info ? 'ON' : 'OFF'
            }
        }

        this.on('input', (msg) => {
            installationObj.state('on')
                .then((info) => {
                    msg.payload = convertOutput(info.value)
                    node.status({
                        text: `Powered '${msg.payload}'`
                    })
                    node.send(msg)
                })
                .catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('power-status', PowerStatus)
}