module.exports = function (RED) {
    'use strict'
    const colors = require('color-name')
    const colorConvert = require('color-convert')
    const isHex = (c) => (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/ui).test(c)

    const matched = (x) => ({
        on: () => matched(x),
        otherwise: () => x
    })

    const match = (x) => ({
        on: (predicate, fn) => (predicate(x) ? matched(fn(x)) : match(x)),
        otherwise: (fn) => fn(x)
    })

    const colorDecoder = (color) => match(color)
        .on((c) => typeof c === 'string' && isHex(c), (c) => [colorConvert.hex.hsv, c.slice(1)])
        .on((c) => typeof c.color === 'string' && isHex(c.color), (c) => [colorConvert.hex.hsv, c.color.slice(1)])
        .on((c) => typeof c === 'string' && colors[c.toLowerCase()], (c) => [colorConvert.keyword.hsv, c.toLowerCase()])
        .on((c) => typeof c.color === 'string' && colors[c.color.toLowerCase()], (c) => [colorConvert.keyword.hsv, c.color.toLowerCase()])
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
            if (!payload) {
                node.error(`Unknown payload type: ${typeof payload}. ${JSON.stringify(payload)}`)
                return
            }

            var decoder = colorDecoder(payload)
            if (decoder === null) {
                node.error(`Unable to decode: ${typeof payload}. ${JSON.stringify(payload)}`)
                return
            }

            var hsv = decoder[0](decoder[1])
            node.status({
                text: `RGB: '${JSON.stringify(colorConvert.hsv.rgb(hsv))}' HSV: '${JSON.stringify(hsv)}'`
            })
            installationObj.setStates({
                hue: { value: hsv[0] },
                sat: { value: hsv[1] },
                brightness: {
                    value: hsv[2],
                    duration: Math.max(0, payload.duration || 0)
                }
            }).catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('color', Color)
}