// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');
class missingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    exec(message, command, type, missing) {
        return message.reply({content: 'You are missing the following permissions: ' + missing.map((perm) => `\`${perm}\``).join(', ')});
    };
};
 
module.exports = missingPermissionsListener;
