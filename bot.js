//-------------------------
//- Node-Library Requires -
//-------------------------
const fs = require('fs'),
        path = require('path');
//-----------------------
//- Other Node Requires -
//-----------------------
const Discord = require('discord.js');
//------------------
//- Local Requires -
//------------------
const options = require('./options.json');
// This is a var because we update this on change
var commands = require(`./${options.commandsFile}`);
//-----------------------
//- Application Constants
//-----------------------
const client = new Discord.Client(),
    prefix = '_',
    creds = JSON.parse(fs.readFileSync(options.credentialsFile));
// Commands file watcher
fs.watch(path.join(__dirname, options.commandsFile), (eventType, filename) => {
    // Delete the key in the require cache
    delete require.cache[path.join(__dirname, options.commandsFile)];
    // Re require the commands
    commands = require(`./${options.commandsFile}`);
});
// Client ready handling
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ game: { name: "with _help" } });
});
// Client message handling
client.on('message', (msg) => {
    let content = msg.content,
            command = content.split(' ')[0];

    if (command.indexOf('_') === 0) {
        command = command.substring(1);
        console.log(`Recieved ${command} from ${msg.author}`);
    }

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
// Client error handling
client.on('error', () => {
    client.clearInterval();

    client.setInterval(() => {
        client.login(creds.token);
    }, 5 * 60 * 1000);
});
// Client disconnect handling
client.on('disconnect', () => {
    client.clearInterval();

    client.setInterval(() => {
        client.login(creds.token);
    }, 5 * 60 * 1000);
});
// Client ready handling
client.on('ready', () => {
    client.clearInterval();
});
// Login
client.login(creds.token);
