const config = require('../config.json');

module.exports = {
    execute: function (args, message, logger) {
        let connection = message.guild.voiceConnection;
        let playing = false;
        if (!connection) {
            message.channel.send('Use !join to let me join a voice channel first.')
                .catch(error => logger.error(error));
        } else if (!playing) {
            playing = true;
            let name = '';
            for (let i = 1; i < args.length; i++) {
                name += (args[i] + ' ');
            }
            name = name.substring(0, name.length-1);
            let dispatcher = connection.playFile(config.paths.sounds_path + name.toLowerCase() + '.mp3', {volume: 0.5});
            dispatcher.setBitrate('auto');
            dispatcher.on('speaking', speaking => {
                if (speaking) message.channel.send('Now playing ' + name + '.mp3')
                    .catch(error => logger.error(error));
            });
            let collector = message.channel.createCollector(m => m);
            let paused = false;
            collector.on('collect', m => {
                if (m.content.startsWith(config.prefix) && !m.author.bot) {
                    let sound_args = m.content.substring(1).split(' ');
                    let sound_cmd = sound_args[0];
                    switch (sound_cmd) {
                        case 'pause':
                            if (!paused && message.guild.voiceConnection.speaking) {
                                m.channel.send('Sound paused.')
                                    .catch(error => logger.error(error));
                                dispatcher.pause();
                                paused = true;
                                logger.info(m.author.username + ' paused sound');
                            }
                            break;
                        case 'resume':
                            if (paused && !message.guild.voiceConnection.speaking) {
                                m.channel.send('Sound resumed.')
                                    .catch(error => logger.error(error));
                                dispatcher.resume();
                                paused = false;
                                logger.info(m.author.username + ' resumed sound');
                            }
                            break;
                        case 'stop':
                            if (message.guild.voiceConnection.speaking) {
                                m.channel.send('Stopping sound.')
                                    .catch(error => logger.error(error));
                                dispatcher.end();
                                playing = false;
                                logger.info(m.author.username + ' stopped sound');
                            }
                            break;
                    }
                }
            });
        }
    }
};