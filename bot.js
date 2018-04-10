//-------------------------
//- Node-Library Requires -
//-------------------------
const fs = require('fs');

//-----------------------
//- Other Node Requires -
//-----------------------
const Discord = require('discord.js');

//-----------------------
//- Application Constants
//-----------------------
const client = new Discord.Client();

// Connected message
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

// Login
client.login(JSON.parse(fs.readFileSync('creds.json')).token);
