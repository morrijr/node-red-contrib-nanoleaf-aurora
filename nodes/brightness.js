module.exports = function (RED) {
    'use strict'

    const clampBrightness = (v) => Math.min(100, Math.max(0, Math.trunc(v)))

    function Brightness(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', (msg) => {
            var payload = msg.payload

            var obj = {}
            if (typeof payload === 'number') {
                obj['value'] = clampBrightness(payload)
            } else if (typeof payload === 'object' &&
                (payload.brightness + payload.duration) &&
                typeof (payload.brightness + payload.duration) === 'number') {
                obj['value'] = clampBrightness(payload.brightness)
                obj['duration'] = payload.duration
            } else {
                node.error(`Unknown payload type: ${typeof payload}. ${JSON.stringify(payload)}`)
                return
            }

            installationObj.setState('brightness', obj)
                .catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('brightness', Brightness)
}