// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Listener } = require('@notenoughupdates/discord-akairo');

class CooldownListener extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    exec(message, command, remaining) {
        let totalSeconds = (remaining / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
            
        let min = minutes;
        let hour = hours;
        let day = days;
            
        if(days === 0) days = '';
        if(days > 0) days = `${day} day(s), `;
            
        if(hours === 0) hours = '';
        if(hours > 0) hours = `${hour} hour(s), `;
            
        if(minutes === 0) minutes = '';
        if(minutes > 0) minutes = `${min} minute(s), `;
        
        return message.reply({content: `You are on cooldown for \`${days}${hours}${minutes}${seconds} seconds\``});
    };
};

module.exports = CooldownListener;
