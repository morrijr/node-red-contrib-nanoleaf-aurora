module.exports = function (RED) {
    "use strict";

    function PowerStatus(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        this.on("input", (msg) => {
            installationObj.api().getPowerStatus()
                .then((info) => {
                    msg.payload = JSON.parse(info).value ? 'ON' : 'OFF';
                    node.status({
                        text: `Powered '${msg.payload}'`
                    });
                    node.send(msg);
                })
                .catch((err) => node.error(err.message, err));
        })
    }

    RED.nodes.registerType("power-status", PowerStatus);
}