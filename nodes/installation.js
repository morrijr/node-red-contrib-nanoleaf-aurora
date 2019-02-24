module.exports = function (RED) {
    'use strict'
    const axios = require('axios')

    function Installation(config) {
        RED.nodes.createNode(this, config)

        this.host = config.host
        this.base = config.base
        this.port = config.port
        this.accessToken = config.accessToken

        this.request = () => axios.create({
            baseURL: `http://${this.host}:${this.port}${this.base}${this.accessToken}`
        })

        this.info = () => this.request().get('/').then(r => r.data)
        this.identify = () => this.request().put('/identify').then(r => r.data)

        this.state = (field) => this.request().get(`/state/${field}`)
            .then(r => r.data.hasOwnProperty('value') ? r.data.value : r.data)

        this.setState = (field, value) => this.setStates({ [field]: value })
        this.setStates = (state) => this.request().put('/state', state)

        this.effects = () => this.request().get('/effects/effectsList').then(r => r.data)
        this.effect = () => this.request().get('/effects/select').then(r => r.data)
        this.setEffect = (name) => this.setEffects({ select: name })
        this.setEffects = (effect) => this.request().put('/effects', effect)
    }

    RED.nodes.registerType('installation', Installation)
}