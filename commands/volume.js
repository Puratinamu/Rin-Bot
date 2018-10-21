module.exports = {
    execute: function (args, message, logger) {
        if (args[1] > 100) {
            message.channel.send('Volume level exceeds limit.')
                .catch(error => logger.error(error));
            logger.info('Rejected high volume request from ' + message.author.username);
        } else {
            try {
                message.guild.voiceConnection.dispatcher.setVolume(args[1]/100);
                message.channel.send('Volume level changed to ' + args[1] + '% of input.')
                    .catch(error => logger.error(error));
                logger.info(message.author.username + ' changed volume to ' + args[1] + '% of input');
            } catch(err) {
                logger.info(message.author.username + ' triggered ' + '\n' + err);
                message.channel.send('Not playing anything right now...')
                    .catch(error => logger.error(error));
            }
        }
    }
};