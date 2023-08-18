module.exports = function (RED) {
    'use strict'

    function Information(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', (msg) => {
            installationObj.info()
                .then((info) => {
                    msg.payload = info
                    node.status({fill: 'green', shape: 'ring', text: 'ok'});
                    node.send(msg)
                })
                .catch((err) => {
                    node.status({fill: 'red', shape: 'dot', text: err.code});
                    node.error(err.message, err)
                })
        })
    }

    RED.nodes.registerType('information', Information)
}