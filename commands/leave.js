module.exports = {
    execute: function (args, message, logger) {
        let voiceConnection = message.guild.voiceConnection;
        logger.info('Disconnect request from ' + message.author.username);
        if (voiceConnection) {
            voiceConnection.disconnect();
            logger.info('Disconnecting from ' + message.guild.name);
        }
    }
};