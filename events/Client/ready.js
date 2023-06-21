// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');

class ReadyListener  extends Listener {
    constructor() {
        super('ReadyListener', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log(`[STARTUP] Logged in as ${this.client.user.tag}\n[CREDIT] Credit to Dragonxz (481211563735253022) for the open source code.`)
    };
};
 
module.exports = ReadyListener;
