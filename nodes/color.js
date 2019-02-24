module.exports = function (RED) {
    'use strict'
    const colors = require('color-name')
    const colorConvert = require('color-convert')

    const matched = (x) => ({
        on: () => matched(x),
        otherwise: () => x
    })

    const match = (x) => ({
        on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
        otherwise: (fn) => fn(x)
    })

    const colorDecoder = (color) => match(color)
        .on((c) => typeof c === 'string' && (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/ui).test(c), (c) => [colorConvert.hex.hsv, c.slice(1)])
        .on((c) => typeof c === 'string' && colors[c.toLowerCase()], (c) => [colorConvert.keyword.hsv, c.toLowerCase()])
        .on((c) => (c.h + c.s + c.v) && typeof (c.h + c.s + c.v) === 'number', (c) => [(i) => i, [c.h, c.s, c.v]])
        .on((c) => (c.h + c.s + c.b) && typeof (c.h + c.s + c.b) === 'number', (c) => [(i) => i, [c.h, c.s, c.b]])
        .on((c) => (c.hue + c.saturation + c.brightness) && typeof (c.hue + c.saturation + c.brightness) === 'number', (c) => [(i) => i, [c.hue, c.saturation, c.brightness]])
        .on((c) => (c.hue + c.saturation + c.value) && typeof (c.hue + c.saturation + c.value) === 'number', (c) => [(i) => i, [c.hue, c.saturation, c.value]])
        .on((c) => (c.r + c.g + c.b) && typeof (c.r + c.g + c.b) === 'number', (c) => [colorConvert.rgb.hsv, [c.r, c.g, c.b]])
        .on((c) => (c.red + c.green + c.blue) && typeof (c.red + c.green + c.blue) === 'number', (c) => [colorConvert.rgb.hsv, [c.red, c.green, c.blue]])
        .on((c) => (c.h + c.s + c.l) && typeof (c.h + c.s + c.l) === 'number', (c) => [colorConvert.hsl.hsv, [c.h, c.s, c.l]])
        .on((c) => (c.c + c.m + c.y + c.k) && typeof (c.c + c.m + c.y + c.k) === 'number', (c) => [colorConvert.cmyk.hsv, [c.c, c.m, c.y, c.k]])
        .otherwise(() => null)

    function Color(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', function (msg) {
            node.status({})
            var payload = msg.payload
            if (payload) {
                var decoder = colorDecoder(payload)
                if (decoder === null) {
                    node.error(`Unable to decode: ${typeof payload}. ${JSON.stringify(payload)}`)
                } else {
                    var hsv = decoder[0](decoder[1])
                    node.status({
                        text: `RGB: '${JSON.stringify(colorConvert.hsv.rgb(hsv))}' HSV: '${JSON.stringify(hsv)}'`
                    })
                    installationObj.setStates({
                        hue: hsv[0],
                        sat: hsv[1],
                        brightness: hsv[2]
                    }).catch((err) => node.error(err.message, err))
                }
            } else {
                node.error(`Unknown payload type: ${typeof payload}. ${JSON.stringify(payload)}`)
            }
        })
    }

    RED.nodes.registerType('color', Color)
}