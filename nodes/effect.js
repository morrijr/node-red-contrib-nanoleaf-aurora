module.exports = function (RED) {
    "use strict";

    function Effect(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        this.on("input", function (msg) {
            var payload = msg.payload;

            if (typeof payload === "string") {
                installationObj.api().setEffect(payload)
                    .then(function (info) {
                        node.send(msg);
                    })
                    .catch(function (err) {
                        node.error(err.message, err);
                    });
            } else {
                node.error("Unknown payload type");
            }
        })
    }

    RED.nodes.registerType("effect", Effect);
}