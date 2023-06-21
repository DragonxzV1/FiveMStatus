// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Task } = require('@notenoughupdates/discord-akairo');
const Discord = require('discord.js');

class topPlayersTask extends Task {
    constructor() {
        super('topPlayers', {
            delay: 60_000,
            runOnStart: true
        });
    };
    async exec() {
        const guild = await this.client.guilds.fetch(this.client.config.Main.guildId).catch((err) => {});
        if (!guild) return console.log('Guild not found.');
        const channel = await guild.channels.fetch(this.client.config.topPlayers.channelId).catch((err) => {});
        if (!channel) return console.log('Channel not found.');

        if (await this.client.db.get('topPlayers.messageId')) {
            const message = await channel.messages.fetch(await this.client.db.get('topPlayers.messageId')).catch((err) => {});
            if (!message) {
                channel.send({
                    embeds: [ new Discord.MessageEmbed().setDescription('Loading...')]
                }).then(async(msg) => {
                    await this.client.db.set('topPlayers.messageId', msg.id);
                });
                console.log(`[TOP-PLAYERS] Message not found, creating new one.`);
            }
        } else {
            channel.send({
                embeds: [ new Discord.MessageEmbed().setDescription('Loading...')]
            }).then(async(msg) => {
                await this.client.db.set('topPlayers.messageId', msg.id);
            });
            console.log(`[TOP-PLAYERS] Message not found, creating new one.`);
        };
        const message = await channel.messages.fetch(await this.client.db.get('topPlayers.messageId')).catch((err) => {});
        const allPlayers = (await this.client.db.all()).filter((x) => x.id.startsWith('playTime_')).filter(async(x) => {
            if ((await this.client.db.get(`playerlist.${x.id.split('_')[1]}.staff`))) {
                return true;
            } else {
                return false;
            };
        }).sort((a,b) => b.value - a.value);
        const topPlayersLeaderboard = [];

        for (let i = 0; i < allPlayers.length; i++) {
            if (i == this.client.config.topPlayers.players) break;
            const user = await this.client.users.fetch(allPlayers[i].id.split('_')[1]).catch((err) => {});

            const totalSeconds = await this.client.db.get(`playTime_${user.id}`);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor(totalSeconds / 3600) % 24;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const seconds = Math.floor(totalSeconds % 60);
            const timeString = `${days ? `${days} days` : ''} ${hours ? `${hours} hours` : ''} ${minutes ? `${minutes} minutes` : ''} ${seconds ? `${seconds} seconds` : ''}`;
            topPlayersLeaderboard.push(`**${i + 1}.** ${user} - ${timeString}`);
        };
        const embed = new Discord.MessageEmbed()
        .setAuthor({
            name: `Top ${this.client.config.topPlayers.players} players in ${guild.name}`,
            iconURL: guild.iconURL({ dynamic: true })
        })
        .setColor(this.client.config.topPlayers.embedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription(topPlayersLeaderboard.join('\n'))
        .setFooter({
            text: 'Updated every 1 minute | Last updated',
            iconURL: guild.iconURL({ dynamic: true })
        }).setTimestamp();
        if (message) await message?.edit({ 
            embeds: [embed]
        }).catch((err) => {});
};
};

module.exports = topPlayersTask;