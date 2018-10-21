module.exports = {
    execute: function (args, message, logger) {
        if (isNaN(args[1])) {
            message.channel.send('Give me a number dummy!')
                .catch(error => logger.error(error));
        } else if (parseInt(args[1]) > 100) {
            message.channel.send('Too much work, give me a smaller number...')
                .catch(error => logger.error(error));
        } else {
            message.delete();
            let delete_last = parseInt(args[1]);
            logger.info(message.author.username + ' deleted ' + args[1] + ' messages in '
                + message.channel.name);
            message.channel.bulkDelete(delete_last)
                .catch(error => {
                    message.channel.send('Something went wrong...')
                        .catch(error => logger.error(error));
                    logger.error(error);
                });
        }
    }
};