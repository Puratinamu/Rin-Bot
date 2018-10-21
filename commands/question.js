module.exports = {
    execute: function (args, message, logger) {
        let answers = {0: 'No', 1: 'Yes', 2: 'Maybe', 3: 'Probably', 4: 'Definitely not',
            5: 'Never in a million years', 6: 'You bet'};
        let answer_key = Math.floor(Math.random()*7);
        message.channel.send(answers[answer_key])
            .catch(error => logger.error(error));
        logger.info('Answered a question from ' + message.author.username);
    }
};