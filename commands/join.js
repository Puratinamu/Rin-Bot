module.exports = {
    execute: function (args, message, logger) {
        let voiceChannel = message.member.voiceChannel;
        logger.info(message.author.username + ' requested me to join ' + message.member.voiceChannel);
        if (!voiceChannel || voiceChannel.type !== 'voice') {
            message.channel.send('Couldn\'t connect to your voice channel.')
                .catch(error => logger.error(error));
        } else {
            voiceChannel.join()
                .then(() => logger.info('Connected to ' +
                    message.member.voiceChannel.name + ' in ' + message.guild.name))
                .catch(console.error);
        }
    }
};