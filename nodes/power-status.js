module.exports = function(RED) {
    "use strict";

    function PowerStatus(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        this.on("input", function(msg) {
            installationObj.api().getPowerStatus()
                .then(function(info) {
                    msg.payload = JSON.parse(info).value ? 'ON' : 'OFF';
                    node.send(msg);
                })
                .catch(function(err) {
                    node.error(err.message, err);
                });
        })
    }

    RED.nodes.registerType("power-status", PowerStatus);
}