module.exports = {
    execute: function (args, message, logger) {
        let contents = fs.readFileSync('./!help.txt', 'utf8');
        message.author.send(contents);
        logger.info('Sent help to ' + message.author.username);
    }
};