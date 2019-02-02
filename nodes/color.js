module.exports = function (RED) {
    "use strict";

    function Color(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        const hPossibles = ['hue', 'h'];
        const sPossibles = ['saturation', 'sat', 's'];
        const vPossibles = ['value', 'v'];
        const rPossibles = ['red', 'r'];
        const gPossibles = ['green', 'g'];
        const bPossibles = ['blue', 'b'];

        const hasPossible = (payload, possible) => possible.some((p) => payload[p]);
        const getPossible = (payload, possible) => possible.map((p) => payload[p]).find((v) => v) || 0;

        const isHSV = (payload) => hasPossible(payload, hPossibles) && hasPossible(payload, sPossibles) && hasPossible(payload, vPossibles);
        const hue = (payload) => getPossible(payload, hPossibles);
        const saturation = (payload) => getPossible(payload, sPossibles);
        const brightness = (payload) => getPossible(payload, vPossibles);

        const isRGB = (payload) => hasPossible(payload, rPossibles) && hasPossible(payload, gPossibles) && hasPossible(payload, bPossibles);
        const red = (payload) => getPossible(payload, rPossibles);
        const green = (payload) => getPossible(payload, gPossibles);
        const blue = (payload) => getPossible(payload, bPossibles);

        this.on("input", function (msg) {
            var payload = msg.payload;
            if (isHSV(payload)) {
                installationObj.api().setHSV(
                    hue(payload),
                    saturation(payload),
                    brightness(payload))
                    .catch(function (err) {
                        node.error(err.message, err);
                    });
            } else if (isRGB(payload)) {
                installationObj.api().setRGB(
                    red(payload),
                    green(payload),
                    blue(payload))
                    .catch(function (err) {
                        node.error(err.message, err);
                    });
            } else {
                node.error(`Unknown payload type: ${typeof payload}. ${payload}`);
            }
        })
    }

    RED.nodes.registerType("color", Color);
}