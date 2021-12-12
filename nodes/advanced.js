module.exports = function (RED) {
    'use strict'
    const axios = require('axios')

    function Advanced(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var installationObj = RED.nodes.getNode(config.installation)

        this.on('input', (msg) => {
            const request = axios.create({
                baseURL: `http://${installationObj.host}:${installationObj.port}${installationObj.base}${config.includeAuthToken ? installationObj.accessToken : ''}`
            })

            var promise
            switch (config.operation) {
                case 'put':
                    promise = request.put(config.uri, msg.payload || {})
                    break
                case 'post':
                    promise = request.post(config.uri, msg.payload || {})
                    break
                case 'get':
                default:
                    promise = request.get(config.uri)
            }

            promise.then((r) => {
                msg.payload = r.data
                node.send(msg)
            }).catch((err) => node.error(err.message, err))
        })
    }

    RED.nodes.registerType('advanced', Advanced)
}