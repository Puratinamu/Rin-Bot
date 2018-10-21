module.exports = {
    execute: function (args, message, logger) {
        message.channel.send('\\**pat pat*\\\*')
            .catch(error => logger.error(error));
        logger.info('Was patted by ' + message.author.username);
    }
};