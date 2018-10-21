module.exports = {
    execute: function (args, message, logger) {
        // Splitting up the input
        let split1 = args[1].split('d');
        if (split1.length === 1) return;
        let split2 = split1[1].split('k');
        // Rolling dice
        let rolls = [];
        let rollText = '(';
        let i;
        let msg;
        if (parseInt(split1[0]) < 100) {
            for (i = 0; i < split1[0]; i++) {
                let num = Math.floor(Math.random()*parseInt(split2[0]) + 1);
                rolls.push(num);
                rollText += String(num) + ', ';
            }
            rollText = rollText.substring(0, rollText.length - 2) + ')';
            // Interpreting adv and disadv
            let sum = 0;
            if (split2.length > 1) {
                rolls.sort(
                    function sortNumber(a,b) {
                        return a - b;
                    });
                if (split2[1].charAt(0) === 'h') {
                    for (i = rolls.length - parseInt(split2[1].substring(1)); i < rolls.length; i++) {
                        sum += rolls[i];
                    }
                } else if (split2[1].charAt(0) === 'l') {
                    for (i = 0; i < parseInt(split2[1].substring(1)); i++) {
                        sum += rolls[i];
                    }
                }
            } else {
                for (i = 0; i < rolls.length; i++) {
                    sum += rolls[i]
                }
            }
            msg = 'rolls: ' + rollText + '\n' + 'total: ' + String(sum);
            logger.info(message.author.username + ' rolled ' + rollText + ' for a total of ' + String(sum));
        } else {
            msg = 'No.';
            logger.info('Rejected large roll request from ' + message.author.username);
        }
        message.channel.send(msg)
            .catch(error => logger.error(error));
    }
};