module.exports = function (RED) {
    'use strict'
    const axios = require('axios')

    function NewAccessToken(config) {
        RED.nodes.createNode(this, config)
        var node = this

        this.on('input', function (msg) {
            axios.post(`http://${config.host}:${config.port}${config.query}`)
                .then(r => {
                    msg.payload = r.data.auth_token
                    node.status({
                        text: `AccessToken: '${msg.payload}'`
                    })
                    node.send(msg)
                })
                .catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('new-access-token', NewAccessToken)
}