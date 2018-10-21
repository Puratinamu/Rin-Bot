module.exports = {
    execute: function (args, message, logger) {
        message.author.send({files:
                [{attachment: './!help.txt',
                    name: '!help.txt'}]
        })
            .catch(console.error);
        logger.info('Sent help file to ' + message.author.username);
    }
};