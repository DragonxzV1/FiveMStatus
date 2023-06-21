const { Command } = require('@notenoughupdates/discord-akairo');
const Discord = require('discord.js');

class IPCommand extends Command {
    constructor() {
        super('IPCommand', {
            aliases: ['ip'],
            description: 'IP Command',
			slash: true,
			slashOptions: [],
            slashGuilds: [],
        });
    };

    async exec(interaction, args) {
        if (this.client.config.Commands.ipCMD.enable) {
            const embed = new Discord.MessageEmbed()
            .setAuthor({
                name: `${interaction.guild.name} | Connection Info`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setColor(this.client.config.Commands.ipCMD.embedColor || 'BLUE')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'IP Connect', value: `\`${this.client.config.playerList.ipandport}\``, inline: true },
                { name: 'Website', value: `[Click Here](${this.client.config.playerList.websiteURL})`, inline: true },
            )
            .setFooter({
                text: `Requested by ${interaction.member.user.tag}`,
                iconURL: interaction.member.user.displayAvatarURL({ dynamic: true })
            }).setTimestamp();
            await interaction.reply({ 
                embeds: [embed]
            });
        };
    };
};

module.exports = IPCommand;