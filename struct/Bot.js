// Don't touch in code, if you don't know what you are doing!
// If you want change config, go to config.json
// If you search host for your bot, you can buy host on https://Fly2Host.co.il or https://discord.gg/KPbZbYjmb8
// Created by: Dragonxz (481211563735253022)

require('dotenv').config();
const Discord = require('discord.js');
const { CommandHandler, ListenerHandler, ContextMenuCommandHandler, TaskHandler, AkairoClient } = require('@notenoughupdates/discord-akairo');
const { QuickDB } = require('quick.db');
const config = require('../config.js');
const db = new QuickDB({ filePath: 'Dragonxz.sqlite' });

class Bot extends AkairoClient {
    constructor() {
        super({
            ownerID: ['481211563735253022']
        },
        {
            intents: Object.keys(Discord.Intents.FLAGS),
            partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER']
        });
        this.db = db;
        this.config = config;
        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            ignoreCooldownID: ['481211563735253022'],
            aliasReplacement: /-/g,
            prefix: this.config.Commands.prefix,
            allowMention: false,
            commandUtil: true,
            commandUtilLifetime: 10000,
            commandUtilSweepInterval: 10000,
            storeMessages: true,
            blockBots: true,
            handleEdits: true,
			autoRegisterSlashCommands: true,
			extensions: ['.js']
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './events/',
            extensions: ['.js']
        });
        this.taskhandler = new TaskHandler(this, {
            directory: './tasks/',
            extensions: ['.js']
        });
        this.start();
        this.setup();
    }

    async setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            taskhandler: this.taskhandler,
            process: process
        });

        this.commandHandler.on('load', (mod, reload) => {
            console.log(`\x1b[36m[COMMAND] ${reload ? 'Reloaded' : 'Loaded'} ${mod.id} command.`);
        });
        this.listenerHandler.on('load', (mod, reload) => {
            console.log(`\x1b[33m[LISTENER] ${reload ? 'Reloaded' : 'Loaded'} ${mod.id} listener.`, '\x1b[0m');
        });
        this.taskhandler.on('load', (mod, reload) => {
            console.log(`\x1b[31m[TASK] ${reload ? 'Reloaded' : 'Loaded'} ${mod.id} task.`, '\x1b[0m');
        });
		const handlers = await Promise.allSettled([
			this.commandHandler
				.loadAll()
				.catch((e) => console.log(`[STARTUP] Error loading commands`, e.stack)),
			this.listenerHandler
				.loadAll()
				.catch((e)=> console.log(`[STARTUP] Error loading listeners`, e.stack)),
            this.taskhandler
                .loadAll()
                .catch((e)=> console.log(`[STARTUP] Error loading tasks`, e.stack))
		]);

        const resolver = this.commandHandler.resolver;
        resolver.addType('1-10', (message, phrase) => {
            const num = resolver.type('integer')(phrase);
            if (num == null) return null;
            if (num < 1 || num > 10) return null;
            return num;
        });

        if (handlers.some((h) => h.status === 'rejected')) {
			throw new Error('At least one handler failed to load.');
		}
    }
    async start() {
        this.login(config.Main.token);
        this.taskhandler.startAll();
    };
};
module.exports = Bot;