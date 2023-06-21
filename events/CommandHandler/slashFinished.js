// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');

class slashFinishedListener  extends Listener {
    constructor() {
        super('slashFinished', {
            emitter: 'commandHandler',
            event: 'slashFinished'
        });
    }

    exec(message, command) {
        return console.log(`\x1b[34m[SLASH COMMAND] ${message.author.tag} used ${command.id.replace('Command', '')} slash command.`, '\x1b[0m');
    };
};
 
module.exports = slashFinishedListener;
