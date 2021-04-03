module.exports = function (RED) {
    'use strict'

    function Identify(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', () => {
            installationObj.identify()
                .catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('identify', Identify)
}