module.exports = function(RED) {
    "use strict";
    var AuroraApi = require('nanoleaf-aurora-client');
    
    function Installation(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.host = config.host;
        this.base = config.base;
        this.port = config.port;
        this.accessToken = config.accessToken;

        this.api = function() {
            return new AuroraApi({
                host: this.host,
                base: this.base,
                port: this.port,
                accessToken: this.accessToken
            });
        }
    }

    RED.nodes.registerType("installation", Installation);
}