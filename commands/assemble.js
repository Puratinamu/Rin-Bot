module.exports = {
    execute: function (args, message, logger) {
        let roles = message.mentions.roles;
        if (message.guild == null) {
            message.channel.send('This command only works inside a guild text channel!')
                .catch(error => logger.error(error));
        } else if (roles.size === 0) {
            message.channel.send('Please @ mention a role(s) in this channel.')
                .catch(error => logger.error(error));
        } else {
            message.channel.send('Assembling members...')
                .catch(error => logger.error(error));
            for (let role of roles.values()) {
                for (let member of role.members.values()) {
                    if (member.id !== message.author.id) {
                        member.send(message.author.username +
                            ' has called for members of ' + role.name + ' to assemble in '
                            + message.guild);
                    }
                }
                logger.info(message.author.username + ' assembled members of ' + role.name +
                    'to assemble in' + message.guild);
            }
        }
    }
};