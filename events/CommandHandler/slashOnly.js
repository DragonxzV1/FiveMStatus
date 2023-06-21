// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');

class slashOnlyListener  extends Listener {
    constructor() {
        super('slashOnly', {
            emitter: 'commandHandler',
            event: 'slashOnly'
        });
    }

    exec(message, command) {
        return message.reply({content: `This command can only be used in a slash command. try \`/${command.aliases}\``});
    };
};
 
module.exports = slashOnlyListener;
