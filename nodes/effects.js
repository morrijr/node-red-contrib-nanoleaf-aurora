module.exports = function(RED) {
    "use strict";

    function Effects(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        this.on("input", function(msg) {
            installationObj.api().listEffects()
                .then(function(effects) {
                    msg.payload = JSON.parse(effects);
                    node.send(msg);
                })
                .catch(function(err) {
                    node.error(err.message, err);
                });
        })
    }

    RED.nodes.registerType("effects", Effects);
}