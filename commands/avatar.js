module.exports = {
    execute: function (args, message, logger) {
        let users = message.mentions.users;
        if (users.size === 0) {
            message.channel.send('Please @ mention a user(s) in this channel.')
                .catch(error => logger.error(error));
        } else {
            message.channel.send('Avatars of all mentioned users were dmed to you.')
                .catch(error => logger.error(error));
            for (let value of users.values()) {
                message.author.send(value.avatarURL);
                logger.info(message.author.username + ' requested the avatar of ' + value.username);
            }
        }
    }
};