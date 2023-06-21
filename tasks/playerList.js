// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

const { Task } = require('@notenoughupdates/discord-akairo');
const Discord = require('discord.js');
const fetch = require('node-fetch');

class playerlistTask extends Task {
    constructor() {
        super('playerlist', {
            delay: 7_000,
            runOnStart: true
        });
    };
    async exec() {
        const guild = await this.client.guilds.fetch(this.client.config.Main.guildId).catch((err) => {});
        if (!guild) return console.log('Guild not found.');
        const channel = await guild.channels.fetch(this.client.config.playerList.channelId).catch((err) => {});
        if (!channel) return console.log('Channel not found.');

        if (await this.client.db.get('playerlist.messageId')) {
            const message = await channel.messages.fetch(await this.client.db.get('playerlist.messageId')).catch((err) => {});
            if (!message) {
                channel.send({
                    embeds: [ new Discord.MessageEmbed().setDescription('Loading...')]
                }).then(async(msg) => {
                    await this.client.db.set('playerlist.messageId', msg.id);
                });
                console.log(`[PLAYERLIST] Message not found, creating new one.`);
            }
        } else {
            channel.send({
                embeds: [ new Discord.MessageEmbed().setDescription('Loading...')]
            }).then(async(msg) => {
                await this.client.db.set('playerlist.messageId', msg.id);
            });
            console.log(`[PLAYERLIST] Message not found, creating new one.`);
        };
        const res = await fetch(`http://${this.client.config.playerList.ipandport}/players.json`).then((res) => res.json()).catch((err) => {});
        const infoRes = await fetch(`http://${this.client.config.playerList.ipandport}/info.json`).then((res) => res.json()).catch((err) => {});
        const message = await channel.messages.fetch(await this.client.db.get('playerlist.messageId')).catch((err) => {});

        if (res && infoRes) {
            const maxClients = infoRes.vars.sv_maxClients;
            const players = [];
            const playersSort = res.sort((a, b) => a.id - b.id);
            let staffCount = 0;

            for (const player of playersSort) {
                let discord = null;
                let staff = null;
                for (const identifiers of player.identifiers) {
                    if (identifiers.startsWith('discord:')) {
                        discord = identifiers.replace('discord:', '');
                        await this.client.db.add(`playTime_${discord}`, 7);
                        const member = await guild.members.fetch(discord).catch((err) => {});
                        if (member) {
                            if (member.roles.cache.has(config.staffRoleId)) {
                                staffCount++;
                                staff = true;
                                await this.client.db.set(`playerlist.${discord}.staff`, true);
                            } else {
                                staff = false;
                                await this.client.db.set(`playerlist.${discord}.staff`, false);
                            };
                        };
                    };
                };
                players.push(`[ ${player.id} ] \`${player.name.replaceAll('`', '')}\` ${discord ? `<@${discord}>` : 'NONE'} ${staff ? '( **Staff** )' : ''}`);
            };
            const embed = new Discord.MessageEmbed()
            .setAuthor({
                name: `${guild.name} Is Online!`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setColor(this.client.config.playerList.embedColorServerOnline || 'GREEN')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
            **Players:** ${res.length}/${maxClients}
            **Staff Online:** ${staffCount == 0 ? 'No Online' : staffCount}\n\n${players.join('\n')}`)
            .setFooter({
                text: 'Last updated at',
                iconURL: guild.iconURL({ dynamic: true })
            }).setTimestamp();
            if (this.client.config.playerList.showFields) {
                embed.addFields(
                    { name: 'IP Connect', value: `\`${this.client.config.playerList.ipandport}\``, inline: true },
                )
                if (this.client.config.playerList.websiteURL) embed.addFields({ name: 'Website', value: `[Click Here](${this.client.config.playerList.websiteURL})`, inline: true });

            }
            if (message) await message?.edit({
                embeds: [embed]
            }).catch((err) => {});
        } else {
            const embed = new Discord.MessageEmbed()
            .setAuthor({
                name: `${guild.name} Is Offline!`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setColor(this.client.config.playerList.embedColorServerOffline || 'DARK_RED')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription('Server is offline.')
            .setFooter({
                text: 'Last updated at',
                iconURL: guild.iconURL({ dynamic: true })
            }).setTimestamp();
            await message?.edit({
                embeds: [embed]
            }).catch((err) => {});
        };
    };
};

module.exports = playerlistTask;