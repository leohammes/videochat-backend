const { ExpressPeerServer } = require('peer');
const express = require('express');
const https = require('https');
const fs = require('fs');

var key  = fs.readFileSync('./certificates/key.pem', 'utf8');
var cert = fs.readFileSync('./certificates/cert.pem', 'utf8');

var credentials = { key, cert };

const app = express();
const DEFAULT_PORT = 5000;

const server = https.createServer(credentials, app);
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
  path: '/videochat',
  ssl: { cert, key },
  key: 'sas'
});

peerServer.on('connection', (client) => { console.log(`Connected: ${client.getId()}`) });
peerServer.on('disconnect', (client) => { console.log(`Disconnected: ${client.getId()}`) });

app.get('/', (req, res, next) => res.send('Hello world!'));
app.use('/server', peerServer);

server.listen(DEFAULT_PORT, () => {
  console.log(`listening at https://localhost:${DEFAULT_PORT}`)
});
