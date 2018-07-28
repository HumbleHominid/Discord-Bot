module.exports = {
    dice: {
        format: 'dice [ number ]',
        desc: 'Rolls a dice. Optional faces of 4, 6, 8, 10, 12, or 20 with default of 6.',
        action(msg) {
            let content = msg.content,
                sides = 6,
                reqSides = content.split(' ')[1],
                dice = [ 4, 6, 8, 10, 12, 20 ];

            if (reqSides !== -1) {
                sides = parseInt(reqSides);

                if (!sides || !(dice.includes(sides))) {
                    msg.reply(`Incorrect format. Please pick one of the following ${dice}.`);

                    return;
                }
            }

            msg.reply(`the dice rolled a ${Math.floor(Math.random() * sides) + 1}.`);
        }
    },
    hello: {
        format: 'hello',
        desc: 'Says hello back!',
        action(msg) {
            msg.reply(`hello!`);
        }
    },
    invite: {
        format: 'invite',
        desc: 'Creates an invite to the curren channel.',
        action(msg) {
            if (msg.guild.available) {
                msg.channel.createInvite()
                .then((invite) => {
                    msg.channel.send(`Created invite ${invite.url}`);
                })
                .catch(() => {
                    msg.channel.send('Unable to crate an invite at this time.');
                });
            }
            else {
                msg.channel.send('Unable to create an invite at this time.');
            }
        }
    },
    poll: {
        format: 'poll "Some message" _option_1 _option_2 ... _option_10',
        desc: 'Creates a poll with optional message. Only supports 10 options. Signal start of a poll with an underscore, e.g. `_`.',
        action(msg) {
            let content = msg.content,
                splitMsg = content.split('_');

            // have to account for the initial command _poll
            if (splitMsg.length > 12 || splitMsg.length < 2) {
                msg.reply('Improper format. Use `_help` to get assistance.');

                return;
            }
            else {
                let channel = msg.channel,
                    responseMsg = 'New poll created!\n',
                    pollMsg = content.substring(content.indexOf('"') + 1,
                            content.lastIndexOf('"')),
                    // I really hate this
                    numMap = {
                        1: 'one',
                        2: 'two',
                        3: 'three',
                        4: 'four',
                        5: 'five',
                        6: 'six',
                        7: 'seven',
                        8: 'eight',
                        9: 'nine',
                        10: 'ten'
                    },
                    emojis = this.guilds.get('174283527926448128').emojis;

                if (pollMsg) {
                    responseMsg = responseMsg + `Poll Message: ${pollMsg}\n`;
                }

                for (let i = 2; i < splitMsg.length; i++) {
                    let emoji = emojis.find('name', `hb_${numMap[i - 1]}`);
                    responseMsg = responseMsg + `\n${emoji} for "${splitMsg[i].trim()}"`;
                }

                channel.send(responseMsg)
                .then((message) => {
                    for (let i = 2; i < splitMsg.length; i++) {
                        message.react(emojis.find('name', `hb_${numMap[i - 1]}`).id)
                        .catch(console.error);
                    }

                    message.createReactionCollector((react, user) => {
                        return react;
                    },
                    {
                        time: 15 * 1000// 24 * 3600 * 1000
                    })
                    .on('end', (collected) => {
                        console.log(`Got ${collected.size} reacts`);
                    });
                })
                .catch(console.error);
            }
        }
    }
}
