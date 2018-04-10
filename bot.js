//-------------------------
//- Node-Library Requires -
//-------------------------
const fs = require('fs');

//-----------------------
//- Other Node Requires -
//-----------------------
const Discord = require('discord.js');

//------------------
//- Local Requires -
//------------------
const commands = require('./commands.js');

//-----------------------
//- Application Constants
//-----------------------
const client = new Discord.Client();
const prefix = '_';

// Connected message
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    let content = msg.content;
    let command = content.substr(prefix.length, content.split(' ')[0].length);

    if (command === 'help') {
        let responseMsg = 'Below is a list of commands followed by a description.\n';

        for (let commandName in commands) {
            let cmdObj = commands[commandName];

            responseMsg = responseMsg + `\`${cmdObj.format}\`\t${cmdObj.desc}\n`;
        }

        msg.reply(responseMsg);
    }

    if (command in commands) {
        commands[command].action.call(client, msg);
    }
});

// Login
client.login(JSON.parse(fs.readFileSync('creds.json')).token);
