module.exports = {
    execute: function (args, message, logger) {
        let range = args[1].split(',');
        let num = Math.floor(Math.random()*parseInt(range[1]) + parseInt(range[0]))
            .catch(error => logger.error(error));
        message.channel.send(String(num))
            .catch(error => logger.error(error));
        logger.info(message.author.username + ' rolled ' + String(num) + 'using !random');
    }
};