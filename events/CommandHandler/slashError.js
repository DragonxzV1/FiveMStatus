// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');

class slashErrorListener  extends Listener {
    constructor() {
        super('slashError', {
            emitter: 'commandHandler',
            event: 'slashError'
        });
    }

    exec(error, command) {
        return console.log(`\x1b[31m[ERROR] ${error} in ${command.content.replace('/', '')} slash command.`, '\x1b[0m') 
    };
};
 
module.exports = slashErrorListener;
