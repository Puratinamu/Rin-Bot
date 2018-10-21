module.exports = {
    execute: function (args, message, logger) {
        let msg = Math.random() <= 0.5 ? 'Meme :clap: Review :clap:' : ':clap: Meme :clap: Review';
        logger.info('Clapped for ' + message.author.username);
        message.channel.send(msg)
            .catch(error => logger.error(error));
    }
};