const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const paths = require('./paths.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity('Type !help for a list of commands', {type: 0})
        .catch(error => logger.error(error));
});

// Receive messages
bot.on('message', message => {
    // Execute message as command if message starts with '!'
    let content = message.content;
    if (content.substring(0, 1) === auth.prefix && !message.author.bot) {
        let args = content.substring(1).split(' ');
        let cmd = args[0];
        if (cmd === 'destroy') bot.destroy();
        else {
            // Load, execute, and unload the command module
            try {
                let command = require(paths.commands_path + cmd);
                command.execute(args, message, logger);
                delete require.cache[command];
            } catch (e) {
                logger.error(e);
            }
        }
     }
});
bot.login(auth.token);
