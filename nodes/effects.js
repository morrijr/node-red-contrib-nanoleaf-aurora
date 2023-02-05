module.exports = function (RED) {
    'use strict'

    function Effects(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        const convertOutputType = (values) => {
            switch (config.outputType) {
                case 'combined':
                    return {
                        selected: values[1],
                        available: values[0]
                    }
                case 'selected':
                    return values[1]
                case 'available':
                default:
                    return values[0]
            }
        }

        this.on('input', function (msg) {
            Promise.all(
                [
                    installationObj.effects(),
                    installationObj.effect()
                ])
                .then((values) => {
                    node.status({
                        text: values[1]
                    })
                    msg.payload = convertOutputType(values)
                    node.send(msg)
                })
                .catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('effects', Effects)
}