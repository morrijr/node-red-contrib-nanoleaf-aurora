module.exports = function(RED) {
    "use strict";
    const request = require('request');

    function NewAccessToken(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("input", function(msg) {
            request({
                method: 'POST',
                url: 'http://' + config.host + ":" + config.port + config.query,
            },
            (error, response, body) => {
                if (error) {
                    node.error(error.message, error);
                    return;
                }
            
                try {
                    msg.payload = JSON.parse(response.body).auth_token;
                    node.status({
                        text: `AccessToken: '${msg.payload}'`
                    });
                    node.send(msg);
                } catch(e) {
                    node.error('AccessToken not created. Check the host address and try again.');
                }                
            });
        })
    }

    RED.nodes.registerType("new-access-token", NewAccessToken);
}