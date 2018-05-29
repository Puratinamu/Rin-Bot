var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity('Type !help for a list of commands', {type: 0});
});
bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    content = message.content
    if (content.substring(0, 1) == auth.prefix && !message.author.bot) {
        var args = content.substring(1).split(' ');
        var cmd = args[0];
        // Commands
        switch(cmd) {
            //!assemble
            case 'assemble':
                var roles = message.mentions.roles;
                if (message.guild == null) {
                    message.channel.send('This command only works inside a guild text channel!');
                } else if (roles.size == 0) {
                    message.channel.send('Please @ mention a role(s) in this channel.');
                } else {
                    message.channel.send('Assembling members...');
                    for (var role of roles.values()) {
                        for (var member of role.members.values()) {
                            if (member.id != message.author.id) {
                                member.send(message.author.username +
                                            ' has called for members of ' + role.name + ' to assemble in '
                                            + message.guild);
                            }
                        }
                    }
                }
            break;
            //!avatar
            case 'avatar':
                var users = message.mentions.users;
                if (users.size == 0) {
                    message.channel.send('Please @ mention a user(s) in this channel.');
                } else {
                    message.channel.send('Avatars of all mentioned users were dmed to you.')
                    for (var value of users.values()) {
                       message.author.send(value.avatarURL);
                    }
                }
            break;
            // !clapclap
            case 'clapclap':
                if (Math.random() <= 0.5) {
                    msg = 'Meme :clap: Review :clap:';
                }
                else {
                    msg = ':clap:Meme :clap: Review';
                }
                message.channel.send(msg);
            break;
            // !clear
            case 'clear':
                if (isNaN(args[1])) {
                    message.channel.send('Give me a number dummy!');
                } else if (parseInt(args[1]) > 100) {
                    message.channel.send('Too much work, give me a smaller number...');
                } else {
                    message.delete();
                    delete_last = parseInt(args[1]);
                    logger.info('Deleting ' + args[1] + ' messages...');
                    message.channel.bulkDelete(delete_last)
                        .catch(error => message.channel.send('Something went wrong...'));
                }
            break;
            // !destroy
            case 'destroy':
                if (message.author.id === auth.owner_id) bot.destroy()
                    .catch(logger.info('Client terminated.'));
            break;
            // !help
            case 'help':
                var fs = require('fs'),
                    contents = fs.readFileSync('./!help.txt', 'utf8');
                message.author.send(contents);
            break;
            // !help_file
            case 'help_file':
                message.author.send({files:
                                    [{attachment: './!help.txt',
                                      name: '!help.txt'}]
                                   })
                    .catch(console.error);
            break;
            // !join
            case 'join':
                var voiceChannel = message.member.voiceChannel;
                if (!voiceChannel || voiceChannel.type != 'voice') {
                    message.channel.send('Couldn\'t connect to your voice channel.');
                } else {
                    voiceChannel.join()
                      .then(connection => logger.info('Connected to ' +
                                                      message.member.voiceChannel.name + ' in ' + message.guild.name))
                      .catch(console.error);
                }
            break;
            // !leave
            case 'leave':
                var connection = message.guild.voiceConnection;
                if (connection) {
                    connection.disconnect();
                    logger.info('Disconnecting from ' + message.guild.name);
                }
            break;
            // !pat
            case 'pat':
                message.channel.send('\\**pat pat*\\\*');
            break;
            // !question
            case 'question':
                answers = {0: 'No', 1: 'Yes', 2: 'Maybe', 3: 'Probably', 4: 'Definitely not',
                           5: 'Never in a million years', 6: 'You bet'}
                answer_key = Math.floor(Math.random()*7)
                message.channel.send(answers[answer_key]);
            break;
            // !random
            case 'random':
                range = args[1].split(',');
                num = Math.floor(Math.random()*parseInt(range[1]) + parseInt(range[0]))
                message.channel.send(String(num));
            break;
            // !roll
            case 'roll':
                // Splitting up the input
                split1 = args[1].split('d');
                if (split1.length == 1) break;
                split2 = split1[1].split('k');
                // Rolling dice
                var rolls = [];
                var rolltext = '(';
                var i;
                if (parseInt(split1[0]) < 100) {
                    for (i = 0; i < split1[0]; i++) {
                        num = Math.floor(Math.random()*parseInt(split2[0]) + 1);
                        rolls.push(num);
                        rolltext += String(num) + ', ';
                    }
                    rolltext = rolltext.substring(0, rolltext.length - 2) + ')';
                    // Interpreting adv and disadv
                    sum = 0;
                    if (split2.length > 1) {
                        rolls.sort(
                            function sortNumber(a,b) {
                                return a - b;
                            });
                        if (split2[1].charAt(0) == 'h') {
                            for (i = rolls.length - parseInt(split2[1].substring(1)); i < rolls.length; i++) {
                                sum += rolls[i];
                            }
                        } else if (split2[1].charAt(0) == 'l') {
                            for (i = 0; i < parseInt(split2[1].substring(1)); i++) {
                                sum += rolls[i];
                            }
                        }
                    } else {
                        for (i = 0; i < rolls.length; i++) {
                            sum += rolls[i]
                        }
                    }
                    msg = 'rolls: ' + rolltext + '\n' + 'total: ' + String(sum)
                } else {
                    msg = 'No.';
                }
                message.channel.send(msg);
            break;
            // !sound
            case 'sound':
                var connection = message.guild.voiceConnection;
                if (!connection) {
                    message.channel.send('Use !join to let me join a voicechannel first.');
                } else {
                    var name = '';
                    for (var i = 1; i < args.length; i++) {
                        name += (args[i] + ' ');
                    }
                    name = name.substring(0, name.length-1);
                    var dispatcher = connection.playFile('./sounds/' + name.toLowerCase() + '.mp3', {volume: 0.5});
                    dispatcher.setBitrate('auto');
                    dispatcher.on('speaking', speaking => {
                        if (speaking) message.channel.send('Now playing ' + name + '.mp3');
                    });
                    var collector = message.channel.createCollector(m => m);
                    var paused = false;
                    collector.on('collect', m => {
                        if (m.content.startsWith(auth.prefix) && !m.author.bot) {
                            var sound_args = m.content.substring(1).split(' ');
                            var sound_cmd = sound_args[0];
                            switch (sound_cmd) {
                                case 'pause':
                                    if (!paused && message.guild.voiceConnection.speaking) {
                                        m.channel.send('Sound paused.');
                                        dispatcher.pause();
                                        paused = true;
                                    }
                                break;
                                case 'resume':
                                    if (paused && !message.guild.voiceConnection.speaking) {
                                        m.channel.send('Sound resumed.');
                                        dispatcher.resume();
                                        paused = false;
                                    }
                                break;
                                case 'stop':
                                    if (message.guild.voiceConnection.speaking) {
                                        m.channel.send('Stopping sound.');
                                        dispatcher.end();
                                    }
                                break;
                            }
                        }
                    });
                }
            break;
            // !success
            case 'success':
                var guild = message.guild;
                if (guild != null) {
                    var emojiID = guild.emojis.find('name', 'PogChamp');
                    if (emojiID != null) {
                        message.channel.send(emojiID.toString());
                    } else {
                        message.channel.send('You need to add a PogChamp emoji to do that.');
                    }
                } else {
                    message.channel.send('I don\'t have nitro so I can\'t dm custom emojis.');
                }
            break;
            // !volume
            case 'volume':
                if (args[1] > 100) {
                    message.channel.send('Volume level exceeds limit.');
                } else {
                    try {
                        message.guild.voiceConnection.dispatcher.setVolume(args[1]/100);
                        message.channel.send('Volume level changed to ' + args[1] + '% of input.');
                    } catch(err) {
                        logger.info(err);
                        message.channel.send('Not playing anything right now...');
                    }
                }
            break;
         }
     }
});
bot.login(auth.token);