const config = require('../config.json');

module.exports = {
    execute: function (args, message, logger) {
        let connection = message.guild.voiceConnection;
        if (!connection) {
            message.channel.send('Use !join to let me join a voice channel first.')
                .catch(error => logger.error(error));
        } else if (!connection.dispatcher) {
            let song_name = '';
            for (let i = 1; i < args.length; i++) {
                song_name += (args[i] + ' ');
            }
            song_name = song_name.substring(0, song_name.length-1);
            logger.info(message.author.username + ' tried to play ' + song_name + ' in ' + message.channel.name);
            let dispatcher = connection.playFile(config.paths.sounds_path + song_name.toLowerCase() + '.mp3', {volume: 0.5});
            dispatcher.setBitrate('auto');
            dispatcher.on('speaking', speaking => {
                if (speaking) {
                    message.channel.send('Now playing ' + song_name + '.mp3')
                        .catch(error => logger.error(error));
                }
            });
            dispatcher.on('end', reason => logger.info('Stopped playing on ' + message.channel.name + ' because ' + reason));
            let collector = message.channel.createCollector(m => m);
            collector.on('collect', m => {
                if (m.content.startsWith(config.prefix) && !m.author.bot) {
                    let sound_args = m.content.substring(1).split(' ');
                    let sound_cmd = sound_args[0];
                    switch (sound_cmd) {
                        case 'pause':
                            if (!dispatcher.paused) {
                                m.channel.send('Sound paused.')
                                    .catch(error => logger.error(error));
                                dispatcher.pause();
                                logger.info(m.author.username + ' paused sound');
                            }
                            break;
                        case 'resume':
                            if (dispatcher.paused) {
                                m.channel.send('Sound resumed.')
                                    .catch(error => logger.error(error));
                                dispatcher.resume();
                                logger.info(m.author.username + ' resumed sound');
                            }
                            break;
                        case 'stop':
                            if (dispatcher) {
                                m.channel.send('Stopping sound.')
                                    .catch(error => logger.error(error));
                                dispatcher.end();
                                dispatcher.destroy();
                                logger.info(m.author.username + ' stopped sound');
                                collector.destroy();
                                break;
                            }
                    }
                }
            });
        }
    }
};