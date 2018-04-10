module.exports = {
    hello: {
        format: 'hello',
        desc: 'Says hello back!',
        action(msg) {
            msg.reply(`Hello ${msg.author}!`);
        }
    },
    invite: {
        format: 'invite',
        desc: 'Creates an invite',
        action(msg) {
            if (msg.guild.available) {
                msg.channel.createInvite().then((invite) => {
                    msg.reply(`Created invite ${invite.url}`);
                })
                .catch(() => {
                    msg.reply('Unable to crate an invite at this time.');
                });
            }
            else {
                msg.reply('Unable to create an invite at this time');
            }
        }
    }
}
